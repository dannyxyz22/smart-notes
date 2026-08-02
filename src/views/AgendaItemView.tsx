import { ItemView, WorkspaceLeaf } from "obsidian";
import * as React from "react";
import { Root, createRoot } from "react-dom/client";
import { AgendaView } from "./AgendaView";
import { SmartNotesSettings } from "../settings";

export const VIEW_TYPE_AGENDA = "smart-notes-agenda-view";

export class AgendaItemView extends ItemView {
  private root: Root | null = null;
  private readonly getSettings: () => SmartNotesSettings;

  constructor(leaf: WorkspaceLeaf, getSettings: () => SmartNotesSettings) {
    super(leaf);
    this.getSettings = getSettings;
  }

  getViewType(): string {
    return VIEW_TYPE_AGENDA;
  }

  getDisplayText(): string {
    return "Agenda";
  }

  getIcon(): string {
    return "calendar-days";
  }

  async onOpen(): Promise<void> {
    this.root = createRoot(this.containerEl.children[1]);
    this.renderView();
  }

  async onClose(): Promise<void> {
    this.root?.unmount();
    this.root = null;
  }

  refresh(): void {
    this.renderView();
  }

  private renderView(): void {
    if (!this.root) return;
    this.root.render(<AgendaView settings={this.getSettings()} />);
  }
}
