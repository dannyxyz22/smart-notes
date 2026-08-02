import { Plugin, WorkspaceLeaf } from "obsidian";
import { BooksItemView, VIEW_TYPE_BOOKS } from "./views/BooksItemView";
import { HomeItemView, VIEW_TYPE_HOME } from "./views/HomeItemView";

export default class SmartNotesBooksPlugin extends Plugin {
  async onload(): Promise<void> {
    this.registerView(
      VIEW_TYPE_HOME,
      (leaf: WorkspaceLeaf) => new HomeItemView(leaf)
    );

    this.registerView(
      VIEW_TYPE_BOOKS,
      (leaf: WorkspaceLeaf) => new BooksItemView(leaf)
    );

    this.addRibbonIcon("home", "Abrir Home (Smart Notes)", () => {
      this.activateHomeView();
    });

    this.addRibbonIcon("book-open", "Abrir Livros (Smart Notes)", () => {
      this.activateBooksView();
    });

    this.addCommand({
      id: "smart-notes-open-home-view",
      name: "Abrir Home dashboard",
      callback: () => this.activateHomeView(),
    });

    this.addCommand({
      id: "smart-notes-open-books-view",
      name: "Abrir view de Livros",
      callback: () => this.activateBooksView(),
    });

    // Deixa a Home pronta como ponto de entrada do plugin.
    await this.activateHomeView();
  }

  onunload(): void {
    // O Obsidian já chama onClose() de cada view aberta; nada de
    // estado global do plugin para limpar aqui por enquanto.
  }

  private async activateHomeView(): Promise<void> {
    await this.activateViewType(VIEW_TYPE_HOME);
  }

  private async activateBooksView(): Promise<void> {
    await this.activateViewType(VIEW_TYPE_BOOKS);
  }

  private async activateViewType(viewType: string): Promise<void> {
    const { workspace } = this.app;

    const existing = workspace.getLeavesOfType(viewType);
    if (existing.length > 0) {
      workspace.revealLeaf(existing[0]);
      return;
    }

    const leaf = workspace.getLeaf("tab");
    await leaf.setViewState({ type: viewType, active: true });
    workspace.revealLeaf(leaf);
  }
}
