import { ItemView, WorkspaceLeaf } from "obsidian";
import * as React from "react";
import { Root, createRoot } from "react-dom/client";
import { HomeView } from "./HomeView";
import { SmartNotesSettings } from "../settings";

export const VIEW_TYPE_HOME = "smart-notes-home-view";

export class HomeItemView extends ItemView {
  private root: Root | null = null;
  private readonly getSettings: () => SmartNotesSettings;

  constructor(leaf: WorkspaceLeaf, getSettings: () => SmartNotesSettings) {
    super(leaf);
    this.getSettings = getSettings;
  }

  getViewType(): string {
    return VIEW_TYPE_HOME;
  }

  getDisplayText(): string {
    return "Home";
  }

  getIcon(): string {
    return "home";
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
    this.root.render(<HomeView app={this.app} settings={this.getSettings()} />);
  }
}
