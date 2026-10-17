import { App, Editor, MarkdownView, Notice, TFile } from "obsidian";
import { ReminderModal } from "./ReminderModal";
import { createGoogleCalendarEvent } from "./googleCalendarAppsScript";
import { SmartNotesSettings } from "../settings";

const POLL_INTERVAL_MS = 1000;
const LOOK_AHEAD_LINES = 5;

export class ReminderManager {
  private app: App;
  private getSettings: () => SmartNotesSettings;
  private treatedPositions: Set<string> = new Set();
  private isModalOpen = false;
  private pollInterval: number | null = null;

  constructor(app: App, getSettings: () => SmartNotesSettings) {
    this.app = app;
    this.getSettings = getSettings;
  }

  registerAutoDetect(): void {
    this.pollInterval = window.setInterval(() => {
      this.checkAllEditors();
    }, POLL_INTERVAL_MS);
  }

  onunload(): void {
    if (this.pollInterval !== null) {
      window.clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  }

  private checkAllEditors(): void {
    if (this.isModalOpen) return;

    const leaves = this.app.workspace.getLeavesOfType("markdown");
    for (const leaf of leaves) {
      const view = leaf.view as MarkdownView;
      const editor = view.editor;
      const file = view.file;
      if (!file) continue;

      const doc = editor.getDoc();
      const lineCount = doc.lineCount();

      for (let line = 0; line < lineCount; line += 1) {
        const lineText = doc.getLine(line);
        if (!lineText.includes("@remind")) continue;

        // Já foi tratado nesta sessão?
        const posKey = `${file.path}:${line}`;
        if (this.treatedPositions.has(posKey)) continue;

        // Já existe registro de lembrete nas próximas linhas?
        if (this.hasReminderRecordNearby(editor, line)) {
          this.treatedPositions.add(posKey);
          continue;
        }

        const idx = lineText.indexOf("@remind");
        this.treatedPositions.add(`${file.path}:${line}:${idx}`);
        this.isModalOpen = true;
        this.openModal(file, lineText, editor, line);
        return; // abre um modal por vez
      }
    }
  }

  /**
   * Verifica se nas próximas LOOK_AHEAD_LINES linhas existe um registro de
   * lembrete já criado (ex: "> 📅 Lembrete criado...").
   */
  private hasReminderRecordNearby(editor: Editor, startLine: number): boolean {
    const lineCount = editor.lineCount();
    const endLine = Math.min(startLine + LOOK_AHEAD_LINES + 1, lineCount);
    for (let l = startLine; l < endLine; l += 1) {
      const text = editor.getLine(l);
      if (
        text.includes("📅 Lembrete criado") ||
        text.includes("Lembrete criado no Google Calendar")
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
    const modal = new ReminderModal(this.app, {
      initialTitle: this.extractTitle(context, file),
      file,
      onCreate: async (title: string, startTime: string, endTime: string) => {
        await this.createReminder(title, startTime, endTime, file, editor, remindLine);
      },
      onClose: () => {
        this.isModalOpen = false;
      },
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
   * Cria o evento no Google Calendar via Apps Script e registra no Markdown.
   */
  async createReminder(
    title: string,
    startTime: string,
    endTime: string,
    file: TFile,
    editor: Editor,
    remindLine: number
  ): Promise<void> {
    const settings = this.getSettings();

    if (!settings.googleCalendarWebhookUrl) {
      new Notice(
        "Configure a URL do webhook nas configurações do plugin (Smart Notes)."
      );
      return;
    }
    if (!settings.googleCalendarApiKey) {
      new Notice(
        "Configure a API Key nas configurações do plugin (Smart Notes)."
      );
      return;
    }

    const vaultName = this.app.vault.getName();
    const obsidianUrl = `obsidian://open?vault=${encodeURIComponent(
      vaultName
    )}&file=${encodeURIComponent(file.path)}`;
    const description = `Lembrete da nota: ${file.path}\n\n${obsidianUrl}`;

    try {
      const response = await createGoogleCalendarEvent(
        settings.googleCalendarWebhookUrl,
        settings.googleCalendarApiKey,
        settings.googleCalendarCalendarId || "primary",
        title,
        startTime,
        endTime,
        description
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

        const recordLine = `> 📅 Lembrete criado: ${title} em ${startDate} — Google Calendar (calendário: ${calendarId ?? "primary"}${eventId ? `, evento: ${eventId}` : ""})`;

        // Insere o registro logo após a linha do @remind.
        const doc = editor.getDoc();
        const insertAt = { line: remindLine + 1, ch: 0 };
        doc.replaceRange(`\n${recordLine}`, insertAt);

        new Notice("Lembrete criado no Google Calendar!");
      } else {
        new Notice(`Erro: ${response.error || "Erro desconhecido"}`);
      }
    } catch (err) {
      new Notice(
        `Erro ao criar lembrete: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    }
  }

  async openManualModal(file: TFile): Promise<void> {
    this.isModalOpen = true;
    const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
    const editor = activeView?.editor;
    if (!editor) {
      new Notice("Não foi possível acessar o editor da nota.");
      return;
    }
    const modal = new ReminderModal(this.app, {
      initialTitle: file.basename,
      file,
      onCreate: async (title: string, startTime: string, endTime: string) => {
        await this.createReminder(title, startTime, endTime, file, editor, 0);
      },
      onClose: () => {
        this.isModalOpen = false;
      },
    });
    modal.open();
  }
}
