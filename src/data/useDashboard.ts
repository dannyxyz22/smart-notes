import { App, TFile } from "obsidian";
import { useCallback, useEffect, useState } from "react";
import { BookRecord } from "../types";
import { toBookRecord } from "./bookRecord";

export interface DashboardTask {
  file: TFile;
  title: string;
  dueDate?: Date;
  done: boolean;
}

export interface DashboardLink {
  label: string;
  file: TFile | null;
}

export interface DashboardConfession {
  file: TFile;
  date: Date;
}

export interface DashboardData {
  books: BookRecord[];
  people: TFile[];
  inboxNotes: TFile[];
  recentNotes: TFile[];
  openTasks: DashboardTask[];
  completedToday: DashboardTask[];
  todayTasks: DashboardTask[];
  upcomingTasks: DashboardTask[];
  lastConfession: DashboardConfession | null;
  links: DashboardLink[];
}

interface FrontmatterShape {
  type?: unknown;
  title?: unknown;
  author?: unknown;
  status?: unknown;
  progress?: unknown;
  rating?: unknown;
  cover?: unknown;
  Done?: unknown;
  done?: unknown;
  modified?: unknown;
  [key: string]: unknown;
}

const HOME_LINKS = [
  { label: "CalendarView", path: "processed/CalendarView" },
  { label: "Pessoas", path: "processed/Pessoas.base" },
  { label: "Journal", path: "processed/Journal.base" },
  { label: "Inbox processing", path: "processed/Inbox processing.base" },
  {
    label: "Wishlist - Lista de livros católicos",
    path: "processed/Wishlist - Lista de livros católicos",
  },
  { label: "Biblioteca", path: "processed/Biblioteca.base" },
  { label: "Confissões", path: "processed/Confissões.md" },
];

function isSameDay(left: Date, right: Date): boolean {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function startOfDay(value: Date): Date {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

function toDate(value: unknown): Date | undefined {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? undefined : value;
  }
  if (typeof value === "number") {
    const fromNumber = new Date(value);
    return Number.isNaN(fromNumber.getTime()) ? undefined : fromNumber;
  }
  if (typeof value === "string") {
    // Treat YYYY-MM-DD as a local date to avoid UTC timezone shift.
    const dateOnly = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (dateOnly) {
      const year = Number(dateOnly[1]);
      const monthIndex = Number(dateOnly[2]) - 1;
      const day = Number(dateOnly[3]);
      const localDate = new Date(year, monthIndex, day);
      return Number.isNaN(localDate.getTime()) ? undefined : localDate;
    }

    const fromString = new Date(value);
    return Number.isNaN(fromString.getTime()) ? undefined : fromString;
  }
  if (value && typeof value === "object") {
    const asRecord = value as Record<string, unknown>;
    const year = asRecord.year;
    const month = asRecord.month;
    const day = asRecord.day;
    if (
      typeof year === "number" &&
      typeof month === "number" &&
      typeof day === "number"
    ) {
      const fromParts = new Date(year, month - 1, day);
      return Number.isNaN(fromParts.getTime()) ? undefined : fromParts;
    }
  }
  return undefined;
}

function isTemplatePath(path: string): boolean {
  return path.toLowerCase().startsWith("templates/");
}

function taskDoneValue(fm: FrontmatterShape): boolean | null {
  if (typeof fm.Done === "boolean") return fm.Done;
  if (typeof fm.done === "boolean") return fm.done;
  return null;
}

function toTask(app: App, file: TFile): DashboardTask | null {
  if (isTemplatePath(file.path)) return null;

  const cache = app.metadataCache.getFileCache(file);
  const fm = (cache?.frontmatter ?? {}) as FrontmatterShape;
  if (fm.type !== "task") return null;
  const done = taskDoneValue(fm);
  if (done === null) return null;
  const dueDate = toDate(fm["Do date"]);

  return {
    file,
    title: typeof fm.title === "string" ? fm.title : file.basename,
    dueDate,
    done,
  };
}

function isInboxPath(path: string): boolean {
  return path.toLowerCase().startsWith("inbox/");
}

function hasType(value: unknown, expected: string): boolean {
  if (typeof value === "string") return value === expected;
  return Array.isArray(value) && value.includes(expected);
}

function computeDashboard(app: App): DashboardData {
  const now = new Date();
  const markdownFiles = app.vault
    .getMarkdownFiles()
    .filter((file) => !isTemplatePath(file.path));
  const books: BookRecord[] = [];
  const people: TFile[] = [];
  const tasks: DashboardTask[] = [];
  const inboxNotes: TFile[] = [];
  let lastConfession: DashboardConfession | null = null;
  const todayStart = startOfDay(now).getTime();

  for (const file of markdownFiles) {
    const cache = app.metadataCache.getFileCache(file);
    const fm = (cache?.frontmatter ?? {}) as FrontmatterShape;

    const maybeBook = toBookRecord(file, fm);
    if (maybeBook) books.push(maybeBook);

    if (hasType(fm.type, "person")) people.push(file);

    const maybeTask = toTask(app, file);
    if (maybeTask) tasks.push(maybeTask);

    if (fm.type === "confession") {
      const confessionDate = toDate(fm["Data da confissão"]);
      if (confessionDate) {
        const confessionStart = startOfDay(confessionDate);
        if (
          confessionStart.getTime() <= todayStart &&
          (!lastConfession || confessionStart.getTime() > lastConfession.date.getTime())
        ) {
          lastConfession = { file, date: confessionStart };
        }
      }
    }

    if (isInboxPath(file.path)) inboxNotes.push(file);
  }

  const openTasks = tasks.filter((task) => !task.done);
  const completedToday = tasks.filter((task) => {
    if (!task.done) return false;
    const cache = app.metadataCache.getFileCache(task.file);
    const fm = (cache?.frontmatter ?? {}) as FrontmatterShape;
    const fromFrontmatter = toDate(fm.modified);
    const fileModifiedAt = new Date(task.file.stat.mtime);

    if (isSameDay(fileModifiedAt, now)) return true;
    if (fromFrontmatter && isSameDay(fromFrontmatter, now)) return true;
    return false;
  });

  const todayTasks = [...tasks]
    .filter((task) => task.dueDate && isSameDay(task.dueDate, now))
    .sort((left, right) => {
      const dateOrder = (left.dueDate?.getTime() ?? 0) - (right.dueDate?.getTime() ?? 0);
      return dateOrder || left.title.localeCompare(right.title);
    });

  const upcomingTasks = [...openTasks]
    .filter((task) => task.dueDate)
    .sort((a, b) => (a.dueDate?.getTime() ?? 0) - (b.dueDate?.getTime() ?? 0));

  const recentNotes = [...markdownFiles]
    .sort((a, b) => b.stat.mtime - a.stat.mtime)
    .slice(0, 8);

  const links: DashboardLink[] = HOME_LINKS.map((item) => {
    const found = app.metadataCache.getFirstLinkpathDest(item.path, "");
    return { label: item.label, file: found };
  });

  books.sort((a, b) => a.title.localeCompare(b.title));
  people.sort((a, b) => a.basename.localeCompare(b.basename));
  inboxNotes.sort((a, b) => b.stat.mtime - a.stat.mtime);

  return {
    books,
    people,
    inboxNotes,
    recentNotes,
    openTasks,
    completedToday,
    todayTasks,
    upcomingTasks,
    lastConfession,
    links,
  };
}

export function useDashboard(app: App): DashboardData {
  const [data, setData] = useState<DashboardData>(() => computeDashboard(app));

  const refresh = useCallback(() => {
    setData(computeDashboard(app));
  }, [app]);

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
