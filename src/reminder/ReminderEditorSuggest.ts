import {
  App,
  Editor,
  EditorPosition,
  EditorSuggest,
  EditorSuggestContext,
  EditorSuggestTriggerInfo,
  TFile,
} from "obsidian";
import type SmartNotesBooksPlugin from "../main";

export interface ReminderSuggestItem {
  label: string;
  description: string;
}

export class ReminderEditorSuggest extends EditorSuggest<ReminderSuggestItem> {
  private plugin: SmartNotesBooksPlugin;

  constructor(plugin: SmartNotesBooksPlugin) {
    super(plugin.app);
    this.plugin = plugin;
  }

  onTrigger(
    cursor: EditorPosition,
    editor: Editor,
    file: TFile | null
  ): EditorSuggestTriggerInfo | null {
    if (!file) return null;

    const line = cursor.line;
    const lineText = editor.getLine(line);
    const textUpToCursor = lineText.substring(0, cursor.ch);

    // Detecta `@` seguido de letras na palavra atual
    const match = textUpToCursor.match(/(?:^|\s)@([a-zA-Z0-9]*)$/);
    if (!match) return null;

    const query = match[1].toLowerCase();

    // IMPORTANTE: SÓ ativa quando o usuário digitar pelo menos "rem" (ex: @rem, @remi, @remind).
    // Se o usuário digitar apenas "@", "@t", "@to", etc., retornamos null para que o
    // Natural Language Dates Redux (e outros plugins de data) funcionem com 100%
    // de prioridade exibindo @today, @tomorrow, @yesterday, etc.
    if (!query.startsWith("rem")) {
      return null;
    }

    const startCh = cursor.ch - query.length - 1; // posição exata do '@'
    return {
      start: { line, ch: startCh },
      end: cursor,
      query,
    };
  }

  getSuggestions(context: EditorSuggestContext): ReminderSuggestItem[] {
    return [
      {
        label: "@remind",
        description: "Criar lembrete no Google Calendar",
      },
    ];
  }

  renderSuggestion(item: ReminderSuggestItem, el: HTMLElement): void {
    el.addClass("smart-notes-suggest-item");
    const container = el.createDiv({ cls: "smart-notes-suggest-row" });
    container.createSpan({ text: "📅 " + item.label, cls: "smart-notes-suggest-badge" });
    container.createSpan({ text: item.description, cls: "smart-notes-suggest-sub" });
  }

  selectSuggestion(
    item: ReminderSuggestItem,
    evt: MouseEvent | KeyboardEvent
  ): void {
    const { editor, start, end, file } = this.context;
    
    // Substitui o trecho `@...` digitado por `@remind `
    editor.replaceRange("@remind ", start, end);
    this.close();

    // Fecha qualquer popup de sugestão que possa ter ficado no DOM
    document.querySelectorAll(".suggestion-container").forEach((el) => {
      (el as HTMLElement).style.display = "none";
    });

    // Dispara o modal de lembrete imediatamente
    if (this.plugin.reminderManager && file) {
      this.plugin.reminderManager.triggerFromSuggest(file, editor, start.line);
    }
  }
}
