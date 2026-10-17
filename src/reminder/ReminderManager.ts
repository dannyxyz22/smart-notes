import { App, Editor, MarkdownView, Notice, TFile } from "obsidian";
import { ReminderModal } from "./ReminderModal";
import { createGoogleCalendarEvent } from "./googleCalendarAppsScript";
import { SmartNotesSettings } from "../settings";

export class ReminderManager {
  private app: App;
  private getSettings: () => SmartNotesSettings;
  private treatedPositions: Set<string> = new Set();
  private isModalOpen = false;
  private editorHandlers: Map<Editor, () => void> = new Map();

  constructor(app: App, getSettings: () => SmartNotesSettings) {
    this.app = app;
    this.getSettings = getSettings;
  }

  registerAutoDetect(): void {
    this.attachToExistingEditors();
    // Re-anexa quando abrir novas abas / splits
    this.app.workspace.on("layout-change", () => this.attachToExistingEditors());
  }

  onunload(): void {
    for (const [editor, remove] of this.editorHandlers) {
      try {
        remove();
      } catch {
        // ignora
      }
    }
    this.editorHandlers.clear();
  }

  private attachToExistingEditors(): void {
    const leaves = this.app.workspace.getLeavesOfType("markdown");
    for (const leaf of leaves) {
      const view = leaf.view as MarkdownView;
      this.attachToEditor(view.editor, view.file);
    }
  }

  private attachToEditor(editor: Editor, file: TFile | null): void {
    if (!file) return;
    if (this.editorHandlers.has(editor)) return;

    const handler = (change: unknown, source: string) => {
      this.handleEditorChange(editor, file, change as any);
    };

    // editor.on existe em runtime (wrapper do CodeMirror no Obsidian)
    (editor as any).on("change", handler);
    this.editorHandlers.set(editor, () => {
      (editor as any).off("change", handler);
    });
  }

  private handleEditorChange(editor: Editor, file: TFile, change: any): void {
    if (this.isModalOpen) return;

    const insertedText = Array.isArray(change?.text)
      ? change.text.join("\n")
      : change?.text ?? change?.insert ?? "";

    if (!insertedText.includes("@remind")) return;

    const doc = editor.getDoc();
    const line = change?.from?.line ?? 0;
    const lineText = doc.getLine(line);
    const idx = lineText.indexOf("@remind");
    if (idx < 0) return;

    const posKey = `${file.path}:${line}:${idx}`;
    if (this.treatedPositions.has(posKey)) return;

    this.treatedPositions.add(posKey);
    this.isModalOpen = true;
    this.openModal(file, lineText);
  }

  private openModal(file: TFile, context: string): void {
    const modal = new ReminderModal(this.app, {
      initialTitle: this.extractTitle(context, file),
      file,
      onCreate: async (title: string, startTime: string, endTime: string) => {
        await this.createReminder(title, startTime, endTime, file);
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

  async createReminder(
    title: string,
    startTime: string,
    endTime: string,
    file: TFile
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
    const modal = new ReminderModal(this.app, {
      initialTitle: file.basename,
      file,
      onCreate: async (title: string, startTime: string, endTime: string) => {
        await this.createReminder(title, startTime, endTime, file);
      },
      onClose: () => {
        this.isModalOpen = false;
      },
    });
    modal.open();
  }
}
