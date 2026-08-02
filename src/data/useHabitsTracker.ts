import { App, TFile } from "obsidian";
import { useCallback, useEffect, useState } from "react";

export interface HabitDef {
  key: string;
  label: string;
  icon: string;
}

export interface HabitDay {
  file: TFile;
  shortLabel: string;
}

export interface HabitRow {
  habit: HabitDef;
  statuses: Array<boolean | null>;
  completionPercent: number;
}

export interface HabitsTrackerData {
  days: HabitDay[];
  rows: HabitRow[];
}

const HABITS: HabitDef[] = [
  { key: "oracao_matinal", label: "Oração matinal", icon: "sunrise" },
  { key: "meditacao", label: "Meditação", icon: "sparkles" },
  { key: "santa_missa", label: "Santa Missa", icon: "church" },
  { key: "visita_santissimo", label: "Visita ao Santíssimo", icon: "footprints" },
  { key: "oracao_pessoal", label: "Oração pessoal", icon: "heart-handshake" },
  { key: "santo_terco", label: "Santo Terço", icon: "flower-2" },
  { key: "mortificacao", label: "Mortificação", icon: "skull" },
  { key: "duolingo", label: "Duolingo", icon: "languages" },
  { key: "pe_paulo_ricardo", label: "Pe. Paulo Ricardo", icon: "play-circle" },
  { key: "comunicacao_alternativa", label: "Comunicação alternativa", icon: "message-circle" },
  { key: "leitura_biblia", label: "Leitura da Bíblia", icon: "book-open" },
  { key: "leitura_espiritual", label: "Leitura espiritual", icon: "library" },
  { key: "exame_consciencia", label: "Exame de consciência", icon: "search" },
  { key: "p_plus", label: "P+", icon: "bookmark-plus" },
];

function isJournalPath(path: string): boolean {
  return path.toLowerCase().startsWith("journal/");
}

function parseStatus(value: unknown): boolean | null {
  if (value === true) return true;
  if (value === false) return false;
  return null;
}

function shortDateLabel(file: TFile): string {
  const match = file.basename.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return file.basename;
  return `${match[3]}/${match[2]}`;
}

function todayKey(): string {
  const now = new Date();
  const yyyy = `${now.getFullYear()}`;
  const mm = `${now.getMonth() + 1}`.padStart(2, "0");
  const dd = `${now.getDate()}`.padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function journalDateKey(file: TFile): string | null {
  const match = file.basename.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  return `${match[1]}-${match[2]}-${match[3]}`;
}

function computeTracker(app: App, daysToShow: number): HabitsTrackerData {
  const maxDate = todayKey();

  const days = app.vault
    .getMarkdownFiles()
    .filter((file) => isJournalPath(file.path))
    .filter((file) => {
      const key = journalDateKey(file);
      if (!key) return true;
      return key <= maxDate;
    })
    .sort((a, b) => b.basename.localeCompare(a.basename))
    .slice(0, daysToShow)
    .map((file) => ({ file, shortLabel: shortDateLabel(file) }));

  const rows: HabitRow[] = HABITS.map((habit) => {
    const statuses = days.map((day) => {
      const cache = app.metadataCache.getFileCache(day.file);
      const fm = cache?.frontmatter as Record<string, unknown> | undefined;
      return parseStatus(fm?.[habit.key]);
    });

    const filled = statuses.filter((status) => status !== null).length;
    const done = statuses.filter((status) => status === true).length;
    const completionPercent = filled === 0 ? 0 : Math.round((done / filled) * 100);

    return { habit, statuses, completionPercent };
  });

  return { days, rows };
}

export function useHabitsTracker(app: App, daysToShow = 7): HabitsTrackerData {
  const [data, setData] = useState<HabitsTrackerData>(() =>
    computeTracker(app, daysToShow)
  );

  const refresh = useCallback(() => {
    setData(computeTracker(app, daysToShow));
  }, [app, daysToShow]);

  useEffect(() => {
    refresh();

    const onChanged = () => refresh();
    const onVaultChange = () => refresh();

    app.metadataCache.on("changed", onChanged);
    app.vault.on("create", onVaultChange);
    app.vault.on("delete", onVaultChange);
    app.vault.on("rename", onVaultChange);
    app.vault.on("modify", onVaultChange);

    return () => {
      app.metadataCache.off("changed", onChanged);
      app.vault.off("create", onVaultChange);
      app.vault.off("delete", onVaultChange);
      app.vault.off("rename", onVaultChange);
      app.vault.off("modify", onVaultChange);
    };
  }, [app, refresh]);

  return data;
}
