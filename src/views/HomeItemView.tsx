import { ItemView, WorkspaceLeaf } from "obsidian";
import * as React from "react";
import { Root, createRoot } from "react-dom/client";
import { HomeView } from "./HomeView";
import { HabitsWindowPreset, SmartNotesSettings } from "../settings";

export const VIEW_TYPE_HOME = "smart-notes-home-view";

export class HomeItemView extends ItemView {
  private root: Root | null = null;
  private readonly getSettings: () => SmartNotesSettings;
  private readonly onHabitsWindowPresetChange: (preset: HabitsWindowPreset) => Promise<void>;

  constructor(
    leaf: WorkspaceLeaf,
    getSettings: () => SmartNotesSettings,
    onHabitsWindowPresetChange: (preset: HabitsWindowPreset) => Promise<void>
  ) {
    super(leaf);
    // A Home ocupa uma aba do editor e deve poder ser substituida por uma nota.
    // Sem isso, buscas no mobile podem abrir o arquivo em outra leaf enquanto
    // o dashboard continua visivel.
    this.navigation = true;
    this.getSettings = getSettings;
    this.onHabitsWindowPresetChange = onHabitsWindowPresetChange;
  }

  getViewType(): string {
    return VIEW_TYPE_HOME;
  }

  getDisplayText(): string {
    return "Smart Notes Home";
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
    this.root.render(
      <HomeView
        app={this.app}
        settings={this.getSettings()}
        leaf={this.leaf}
        onHabitsWindowPresetChange={this.onHabitsWindowPresetChange}
      />
    );
  }
}
