import { Plugin, WorkspaceLeaf } from "obsidian";
import { BooksItemView, VIEW_TYPE_BOOKS } from "./views/BooksItemView";

export default class SmartNotesBooksPlugin extends Plugin {
  async onload(): Promise<void> {
    this.registerView(
      VIEW_TYPE_BOOKS,
      (leaf: WorkspaceLeaf) => new BooksItemView(leaf)
    );

    this.addRibbonIcon("book-open", "Abrir Livros (Smart Notes)", () => {
      this.activateView();
    });

    this.addCommand({
      id: "smart-notes-open-books-view",
      name: "Abrir view de Livros",
      callback: () => this.activateView(),
    });
  }

  onunload(): void {
    // O Obsidian já chama onClose() de cada view aberta; nada de
    // estado global do plugin para limpar aqui por enquanto.
  }

  private async activateView(): Promise<void> {
    const { workspace } = this.app;

    const existing = workspace.getLeavesOfType(VIEW_TYPE_BOOKS);
    if (existing.length > 0) {
      workspace.revealLeaf(existing[0]);
      return;
    }

    const leaf = workspace.getLeaf("tab");
    await leaf.setViewState({ type: VIEW_TYPE_BOOKS, active: true });
    workspace.revealLeaf(leaf);
  }
}
