import { App, Plugin, PluginSettingTab, Setting, WorkspaceLeaf } from "obsidian";
import { BooksItemView, VIEW_TYPE_BOOKS } from "./views/BooksItemView";
import { HomeItemView, VIEW_TYPE_HOME } from "./views/HomeItemView";
import {
  DEFAULT_ICS_CALENDARS,
  DEFAULT_SETTINGS,
  SmartNotesSettings,
} from "./settings";

export default class SmartNotesBooksPlugin extends Plugin {
  settings: SmartNotesSettings = DEFAULT_SETTINGS;

  async onload(): Promise<void> {
    await this.loadSettings();

    this.registerView(
      VIEW_TYPE_HOME,
      (leaf: WorkspaceLeaf) => new HomeItemView(leaf, () => this.settings)
    );

    this.registerView(
      VIEW_TYPE_BOOKS,
      (leaf: WorkspaceLeaf) => new BooksItemView(leaf)
    );

    this.addRibbonIcon("layout-dashboard", "Abrir dashboard (Smart Notes)", () => {
      this.activateHomeView();
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

    this.addSettingTab(new SmartNotesSettingTab(this.app, this));

    // Aguarda o workspace estar pronto para abrir a Home sem erro de tab group.
    this.app.workspace.onLayoutReady(() => {
      this.activateHomeView();
    });
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

    const leaf = workspace.getLeaf("tab") ?? workspace.getLeaf();
    await leaf.setViewState({ type: viewType, active: true });
    workspace.revealLeaf(leaf);
  }

  async saveSettings(): Promise<void> {
    // Cria nova referência de array para que useMemo em HomeView detecte a mudança.
    this.settings = {
      ...this.settings,
      icsCalendars: this.settings.icsCalendars.map((cal) => ({ ...cal })),
    };
    await this.saveData(this.settings);
    this.refreshHomeViews();
  }

  private async loadSettings(): Promise<void> {
    const data = (await this.loadData()) as Partial<SmartNotesSettings> | null;

    const agendaDaysAhead = this.normalizeDays(data?.agendaDaysAhead);
    const icsCalendars = this.normalizeCalendars(data?.icsCalendars);

    this.settings = {
      agendaDaysAhead,
      icsCalendars,
    };
  }

  private normalizeDays(value: unknown): number {
    if (typeof value !== "number" || Number.isNaN(value)) {
      return DEFAULT_SETTINGS.agendaDaysAhead;
    }

    return Math.min(90, Math.max(1, Math.round(value)));
  }

  private normalizeCalendars(value: unknown): SmartNotesSettings["icsCalendars"] {
    // Primeira instalação: ainda sem data.json salvo.
    if (value === null || value === undefined) {
      return DEFAULT_ICS_CALENDARS.map((item) => ({ ...item }));
    }
    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .map((entry) => {
        if (!entry || typeof entry !== "object") return null;
        const source = entry as Record<string, unknown>;
        const name = typeof source.name === "string" ? source.name.trim() : "";
        const url = typeof source.url === "string" ? source.url.trim() : "";
        const colorRaw = typeof source.color === "string" ? source.color.trim() : "";

        // Descarta entradas completamente vazias (nome E url ausentes).
        if (!name && !url) return null;

        const color = /^#[0-9a-fA-F]{6}$/.test(colorRaw) ? colorRaw : "#039BE5";
        return { name, url, color };
      })
      .filter((item): item is SmartNotesSettings["icsCalendars"][number] =>
        Boolean(item)
      );
  }

  private refreshHomeViews(): void {
    const leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE_HOME);
    for (const leaf of leaves) {
      const view = leaf.view;
      if (view instanceof HomeItemView) {
        view.refresh();
      }
    }
  }
}

class SmartNotesSettingTab extends PluginSettingTab {
  private readonly plugin: SmartNotesBooksPlugin;

  constructor(app: App, plugin: SmartNotesBooksPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl("h2", { text: "Smart Notes - Agenda ICS" });

    new Setting(containerEl)
      .setName("Dias para mostrar")
      .setDesc("Quantidade de dias futuros exibidos na Agenda (1 a 90).")
      .addText((text) => {
        text.inputEl.type = "number";
        text.inputEl.min = "1";
        text.inputEl.max = "90";
        text.setValue(String(this.plugin.settings.agendaDaysAhead));
        text.onChange(async (value) => {
          const parsed = Number(value);
          if (!Number.isFinite(parsed)) return;

          this.plugin.settings.agendaDaysAhead = Math.min(
            90,
            Math.max(1, Math.round(parsed))
          );
          await this.plugin.saveSettings();
          this.display();
        });
      });

    containerEl.createEl("h3", { text: "Calendarios" });
    containerEl.createEl("p", {
      text: "Adicione feeds ICS do Google Calendar (url private-.../basic.ics).",
    });

    const listEl = containerEl.createDiv();

    const renderCalendarList = () => {
      listEl.empty();

      this.plugin.settings.icsCalendars.forEach((calendar, index) => {
        const block = listEl.createDiv();
        block.addClass("smart-notes-settings-calendar");

        new Setting(block)
          .setName(`Calendario ${index + 1}`)
          .setDesc("Nome exibido na agenda")
          .addText((text) => {
            text.setPlaceholder("Ex.: Trabalho");
            text.setValue(calendar.name);
            text.onChange(async (value) => {
              this.plugin.settings.icsCalendars[index].name = value;
              await this.plugin.saveSettings();
            });
          })
          .addExtraButton((button) => {
            button.setIcon("trash");
            button.setTooltip("Remover calendario");
            button.onClick(async () => {
              this.plugin.settings.icsCalendars.splice(index, 1);
              await this.plugin.saveSettings();
              renderCalendarList();
            });
          });

        new Setting(block).setName("URL ICS").addText((text) => {
          text.setPlaceholder("https://calendar.google.com/calendar/ical/.../basic.ics");
          text.setValue(calendar.url);
          text.onChange(async (value) => {
            this.plugin.settings.icsCalendars[index].url = value;
            await this.plugin.saveSettings();
          });
        });

        new Setting(block).setName("Cor").setDesc("Hex #RRGGBB").addText((text) => {
          text.setPlaceholder("#009688");
          text.setValue(calendar.color);
          text.onChange(async (value) => {
            this.plugin.settings.icsCalendars[index].color = value;
            await this.plugin.saveSettings();
          });
        });

        block.createEl("hr");
      });
    };

    renderCalendarList();

    new Setting(containerEl)
      .setName("Adicionar calendario")
      .setDesc("Cria uma nova entrada para configurar outro feed ICS.")
      .addButton((button) => {
        button.setButtonText("Adicionar");
        button.onClick(async () => {
          this.plugin.settings.icsCalendars.push({
            name: "Novo calendario",
            url: "",
            color: "#039BE5",
          });
          await this.plugin.saveSettings();
          renderCalendarList();
        });
      });

    new Setting(containerEl)
      .setName("Restaurar padrao")
      .setDesc("Restaura os calendarios iniciais e 21 dias de janela.")
      .addButton((button) => {
        button.setWarning();
        button.setButtonText("Restaurar");
        button.onClick(async () => {
          this.plugin.settings = {
            agendaDaysAhead: DEFAULT_SETTINGS.agendaDaysAhead,
            icsCalendars: DEFAULT_ICS_CALENDARS.map((entry) => ({ ...entry })),
          };
          await this.plugin.saveSettings();
          this.display();
        });
      });
  }
}
