import { ItemView, WorkspaceLeaf } from "obsidian";
import * as React from "react";
import { Root, createRoot } from "react-dom/client";
import { BooksView } from "./BooksView";

export const VIEW_TYPE_BOOKS = "smart-notes-books-view";

/**
 * Ponte entre o mundo Obsidian (ItemView, ciclo de vida de painéis)
 * e o mundo React (componentes, estado). O React nunca acessa o
 * vault diretamente fora daqui além do que é passado via props;
 * quem lê/escreve arquivos é sempre a API do Obsidian.
 */
export class BooksItemView extends ItemView {
  private root: Root | null = null;

  getViewType(): string {
    return VIEW_TYPE_BOOKS;
  }

  getDisplayText(): string {
    return "Livros";
  }

  getIcon(): string {
    return "book-open";
  }

  async onOpen(): Promise<void> {
    this.root = createRoot(this.containerEl.children[1]);
    this.root.render(<BooksView app={this.app} />);
  }

  async onClose(): Promise<void> {
    this.root?.unmount();
    this.root = null;
  }

  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
  }
}
