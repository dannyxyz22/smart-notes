import { ItemView, WorkspaceLeaf } from "obsidian";
import * as React from "react";
import { Root, createRoot } from "react-dom/client";
import { HomeView } from "./HomeView";

export const VIEW_TYPE_HOME = "smart-notes-home-view";

export class HomeItemView extends ItemView {
  private root: Root | null = null;

  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
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
    this.root.render(<HomeView app={this.app} />);
  }

  async onClose(): Promise<void> {
    this.root?.unmount();
    this.root = null;
  }
}
