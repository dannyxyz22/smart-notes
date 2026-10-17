import {
  App,
  Editor,
  MarkdownFileInfo,
  MarkdownView,
  Notice,
  Plugin,
  TFile,
} from "obsidian";
import { ReminderModal } from "./ReminderModal";
import { createGoogleCalendarEvent } from "./googleCalendarAppsScript";
import { SmartNotesSettings } from "../settings";

const POLL_INTERVAL_MS = 1000;
const LOOK_AHEAD_LINES = 5;

export class ReminderManager {
  private plugin: Plugin;
  private app: App;
  private getSettings: () => SmartNotesSettings;
  private isModalOpen = false;
  private pollInterval: number | null = null;
  private typingTimeout: number | null = null;
  /**
   * Guarda linhas que foram dispensadas pelo usuário com o texto exato daquela linha.
   * Se o usuário alterar a linha (ex: digitar @remind novamente), a linha se torna
   * elegível de imediato.
   */
  private dismissedLines: Map<string, string> = new Map();

  constructor(plugin: Plugin, getSettings: () => SmartNotesSettings) {
    this.plugin = plugin;
    this.app = plugin.app;
    this.getSettings = getSettings;
  }

  registerAutoDetect(): void {
    // 1. Intercepta teclas Enter, Tab ou Espaço na fase de captura (capture: true).
    // Isso garante que se o usuário estiver em @remind, o modal abre na hora
    // e o Natural Language Dates Redux não capture o Enter transformando @remind em data inválida.
    this.plugin.registerDomEvent(
      window,
      "keydown",
      (evt: KeyboardEvent) => {
        if (evt.key !== "Enter" && evt.key !== "Tab" && evt.key !== " ") {
          return;
        }
        if (this.isModalOpen) return;

        const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (!activeView) return;

        const editor = activeView.editor;
        const file = activeView.file ?? this.app.workspace.getActiveFile();
        if (!editor || !file) return;

        const cursor = editor.getCursor();
        const lineText = editor.getLine(cursor.line);
        const textBeforeCursor = lineText.substring(0, cursor.ch).trimEnd();

        if (textBeforeCursor.endsWith("@remind")) {
          // Bloqueia qualquer captura do NLDates antes que ele substitua por data inválida
          evt.preventDefault();
          evt.stopPropagation();

          this.closeActiveSuggests();
          this.isModalOpen = true;
          this.openModal(file, lineText, editor, cursor.line);
        }
      },
      true // capture phase
    );

    // 2. Detecção em tempo real via editor-change (para quando terminar de digitar ou colar)
    this.plugin.registerEvent(
      this.app.workspace.on(
        "editor-change",
        (editor: Editor, info: MarkdownView | MarkdownFileInfo) => {
          this.handleEditorChange(editor, info);
        }
      )
    );

    // 3. Polling periódico como garantia de fallback
    this.pollInterval = window.setInterval(() => {
      this.checkAllEditors();
    }, POLL_INTERVAL_MS);
  }

  onunload(): void {
    if (this.pollInterval !== null) {
      window.clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
    if (this.typingTimeout !== null) {
      window.clearTimeout(this.typingTimeout);
      this.typingTimeout = null;
    }
    this.dismissedLines.clear();
  }

  /**
   * Fecha ativamente qualquer menu flutuante de sugestões (ex: NLDates Redux)
   * para evitar disputas de foco e captura indevida de teclas.
   */
  private closeActiveSuggests(): void {
    try {
      (this.app.workspace as any).activeEditor?.editor?.closeSuggest?.();
    } catch {}
    try {
      (this.app as any).editorSuggest?.close();
    } catch {}
    document.querySelectorAll(".suggestion-container").forEach((el) => {
      (el as HTMLElement).style.display = "none";
    });
  }

  /**
   * Detecta o range de linhas do frontmatter YAML (delimitado por ---).
   * Retorna { start: 0, end: l } ou null caso não haja frontmatter.
   */
  private getFrontmatterRange(editor: Editor): { start: number; end: number } | null {
    const lineCount = editor.lineCount();
    if (lineCount === 0) return null;
    const firstLine = editor.getLine(0).trim();
    if (firstLine !== "---") return null;

    for (let l = 1; l < lineCount; l += 1) {
      const text = editor.getLine(l).trim();
      if (text === "---" || text === "...") {
        return { start: 0, end: l };
      }
    }
    return null;
  }

  private isLineInFrontmatter(editor: Editor, line: number): boolean {
    const fm = this.getFrontmatterRange(editor);
    if (!fm) return false;
    return line >= fm.start && line <= fm.end;
  }

  /**
   * Calcula uma linha de inserção 100% segura que NUNCA invade o frontmatter YAML.
   */
  private getSafeInsertLine(editor: Editor, preferredLine?: number): number {
    const fm = this.getFrontmatterRange(editor);
    const lineCount = editor.lineCount();

    if (preferredLine !== undefined && preferredLine >= 0) {
      if (fm && preferredLine <= fm.end) {
        return Math.min(fm.end + 1, lineCount);
      }
      return Math.min(preferredLine + 1, lineCount);
    }

    const cursor = editor.getCursor();
    if (fm && cursor.line <= fm.end) {
      return Math.min(fm.end + 1, lineCount);
    }
    return Math.min(cursor.line + 1, lineCount);
  }

  /**
   * Tratamento acionado pelo evento `editor-change` do Obsidian com debounce suave.
   */
  private handleEditorChange(
    editor: Editor,
    viewOrInfo: MarkdownView | MarkdownFileInfo
  ): void {
    if (this.isModalOpen) return;

    const file =
      (viewOrInfo as MarkdownView).file ??
      (viewOrInfo as any).file ??
      this.app.workspace.getActiveFile();
    if (!file) return;

    const cursor = editor.getCursor();
    const line = cursor.line;
    if (line < 0 || line >= editor.lineCount()) return;

    const lineText = editor.getLine(line);
    if (!lineText.includes("@remind")) return;

    // Nunca dispara dentro do frontmatter YAML
    if (this.isLineInFrontmatter(editor, line)) return;

    // Nunca dispara se já houver registro criado abaixo
    if (this.hasReminderRecordNearby(editor, line)) return;

    // Não reabre se o usuário já dispensou essa linha sem alterá-la
    const posKey = `${file.path}:${line}`;
    if (this.dismissedLines.get(posKey) === lineText) return;

    if (this.typingTimeout !== null) {
      window.clearTimeout(this.typingTimeout);
    }

    this.typingTimeout = window.setTimeout(() => {
      this.typingTimeout = null;
      if (this.isModalOpen) return;
      const currentLineText = editor.getLine(line);
      if (!currentLineText.includes("@remind")) return;
      if (this.hasReminderRecordNearby(editor, line)) return;

      this.closeActiveSuggests();
      this.isModalOpen = true;
      this.openModal(file, currentLineText, editor, line);
    }, 300);
  }

  /**
   * Polling periódico sobre todos os editores abertos.
   */
  private checkAllEditors(): void {
    if (this.isModalOpen) return;

    const leaves = this.app.workspace.getLeavesOfType("markdown");
    for (const leaf of leaves) {
      const view = leaf.view;
      if (!(view instanceof MarkdownView)) continue;
      const editor = view.editor;
      const file = view.file;
      if (!editor || !file) continue;

      const doc = editor.getDoc();
      const lineCount = doc.lineCount();
      const fm = this.getFrontmatterRange(editor);
      const startLine = fm ? fm.end + 1 : 0;

      for (let line = startLine; line < lineCount; line += 1) {
        const lineText = doc.getLine(line);
        if (!lineText.includes("@remind")) continue;

        if (this.hasReminderRecordNearby(editor, line)) continue;

        const posKey = `${file.path}:${line}`;
        if (this.dismissedLines.get(posKey) === lineText) continue;

        this.closeActiveSuggests();
        this.isModalOpen = true;
        this.openModal(file, lineText, editor, line);
        return; // abre um modal por vez
      }
    }
  }

  /**
   * Verifica se nas próximas LOOK_AHEAD_LINES linhas (abaixo da linha atual)
   * existe um registro de lembrete já criado (ex: "> 📅 Lembrete criado...").
   */
  private hasReminderRecordNearby(editor: Editor, startLine: number): boolean {
    const lineCount = editor.lineCount();
    const endLine = Math.min(startLine + LOOK_AHEAD_LINES + 1, lineCount);
    for (let l = startLine + 1; l < endLine; l += 1) {
      const text = editor.getLine(l);
      if (
        text.includes("📅 Lembrete criado") ||
        text.includes("📅Lembrete criado") ||
        text.includes("Lembrete criado")
      ) {
        return true;
      }
    }
    return false;
  }

  private openModal(
    file: TFile,
    context: string,
    editor: Editor,
    remindLine: number
  ): void {
    this.closeActiveSuggests();
    const posKey = `${file.path}:${remindLine}`;

    const removeRemindTag = () => {
      const lineCount = editor.lineCount();
      if (remindLine < lineCount) {
        const lineText = editor.getLine(remindLine);
        const idx = lineText.indexOf("@remind");
        if (idx >= 0) {
          const before = lineText.slice(0, idx);
          const after = lineText.slice(idx + "@remind".length);
          editor.replaceRange(
            before + after,
            { line: remindLine, ch: 0 },
            { line: remindLine, ch: lineText.length }
          );
        }
        // Registra o texto resultante como dispensado
        this.dismissedLines.set(posKey, editor.getLine(remindLine));
      }
      this.isModalOpen = false;
    };

    const modal = new ReminderModal(this.app, {
      initialTitle: this.extractTitle(context, file),
      file,
      onCreate: async (title: string, startTime: string, endTime: string) => {
        await this.createReminder(
          title,
          startTime,
          endTime,
          file,
          editor,
          remindLine
        );
      },
      onClose: () => {
        this.isModalOpen = false;
      },
      onCancel: removeRemindTag,
    });
    modal.open();
  }

  private extractTitle(context: string, file: TFile): string {
    const match = context.match(/@remind\s*(.+)/i);
    if (match && match[1].trim()) {
      return match[1].trim();
    }
    return file.basename;
  }

  /**
   * Cria o evento no Google Calendar via Apps Script e registra no Markdown
   * garantindo que nunca quebre o frontmatter.
   */
  async createReminder(
    title: string,
    startTime: string,
    endTime: string,
    file: TFile,
    editor: Editor,
    preferredLine?: number
  ): Promise<void> {
    const settings = this.getSettings();

    if (!settings.googleCalendarWebhookUrl) {
      new Notice(
        "Configure a URL do webhook nas configurações do plugin (Smart Notes)."
      );
      throw new Error("URL do webhook não configurada.");
    }
    if (!settings.googleCalendarApiKey) {
      new Notice(
        "Configure a API Key nas configurações do plugin (Smart Notes)."
      );
      throw new Error("API Key não configurada.");
    }

    const vaultName = this.app.vault.getName();
    const obsidianUrl = `obsidian://open?vault=${encodeURIComponent(
      vaultName
    )}&file=${encodeURIComponent(file.path)}`;
    const description = `Lembrete da nota: <a href="${obsidianUrl}">${file.basename}</a><br><br><a href="${obsidianUrl}">${obsidianUrl}</a>`;

    const response = await createGoogleCalendarEvent(
      settings.googleCalendarWebhookUrl,
      settings.googleCalendarApiKey,
      settings.googleCalendarCalendarId || "primary",
      title,
      startTime,
      endTime,
      description,
      5 // Alerta com 5 minutos de antecedência no Google Calendar
    );

    if (response.status === "ok") {
      const eventId = (response.data as Record<string, unknown> | undefined)?.eventId;
      const calendarId = (response.data as Record<string, unknown> | undefined)?.calendarId;

      const startDate = new Date(startTime).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      const recordLine = `> 📅 Lembrete criado para ${startDate}`;

      // Encontra uma linha estritamente fora do frontmatter YAML
      const insertLine = this.getSafeInsertLine(editor, preferredLine);
      const doc = editor.getDoc();
      const lineCount = doc.lineCount();
      const targetLine = Math.min(insertLine, lineCount);

      doc.replaceRange(`\n${recordLine}\n`, { line: targetLine, ch: 0 });

      // Limpa dispensa da linha caso existisse
      if (preferredLine !== undefined) {
        this.dismissedLines.delete(`${file.path}:${preferredLine}`);
      }

      new Notice("Lembrete criado no Google Calendar!");
    } else {
      throw new Error(response.error || "Erro desconhecido");
    }
  }

  async openManualModal(file: TFile): Promise<void> {
    const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
    const editor = activeView?.editor;
    if (!editor) {
      new Notice("Não foi possível acessar o editor da nota.");
      return;
    }

    const cursor = editor.getCursor();
    const fm = this.getFrontmatterRange(editor);
    // Se o cursor estiver dentro do frontmatter, usa o fim do frontmatter
    const initialLine = fm && cursor.line <= fm.end ? fm.end : cursor.line;

    this.isModalOpen = true;
    const modal = new ReminderModal(this.app, {
      initialTitle: file.basename,
      file,
      onCreate: async (title: string, startTime: string, endTime: string) => {
        await this.createReminder(
          title,
          startTime,
          endTime,
          file,
          editor,
          initialLine
        );
      },
      onClose: () => {
        this.isModalOpen = false;
      },
    });
    modal.open();
  }
}
