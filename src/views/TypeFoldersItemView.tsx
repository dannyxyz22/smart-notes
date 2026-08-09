import * as React from "react";
import { ItemView, WorkspaceLeaf } from "obsidian";
import { Root, createRoot } from "react-dom/client";
import { TypeFoldersView } from "./TypeFoldersView";

export const VIEW_TYPE_TYPE_FOLDERS = "smart-notes-type-folders-view";

export class TypeFoldersItemView extends ItemView {
  private root: Root | null = null;

  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
  }

  getViewType(): string {
    return VIEW_TYPE_TYPE_FOLDERS;
  }

  getDisplayText(): string {
    return "Notas por tipo";
  }

  getIcon(): string {
    return "folders";
  }

  async onOpen(): Promise<void> {
    this.root = createRoot(this.containerEl.children[1]);
    this.root.render(<TypeFoldersView app={this.app} />);
  }

  async onClose(): Promise<void> {
    this.root?.unmount();
    this.root = null;
  }
}
