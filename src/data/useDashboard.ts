import { App, TFile } from "obsidian";
import { useCallback, useEffect, useState } from "react";
import { BookRecord, BOOK_TYPE } from "../types";

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

export interface DashboardData {
  books: BookRecord[];
  inboxNotes: TFile[];
  recentNotes: TFile[];
  openTasks: DashboardTask[];
  completedToday: DashboardTask[];
  upcomingTasks: DashboardTask[];
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
    label: "Wishlist - Lista de livros catolicos",
    path: "processed/Wishlist - Lista de livros catolicos",
  },
  { label: "Biblioteca", path: "processed/Biblioteca.base" },
];

function isSameDay(left: Date, right: Date): boolean {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
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
    const fromString = new Date(value);
    return Number.isNaN(fromString.getTime()) ? undefined : fromString;
  }
  return undefined;
}

function normalizeBook(file: TFile, fm: FrontmatterShape): BookRecord | null {
  if (fm.type !== BOOK_TYPE) return null;
  return {
    file,
    title: typeof fm.title === "string" ? fm.title : file.basename,
    author: typeof fm.author === "string" ? fm.author : undefined,
    status: typeof fm.status === "string" ? fm.status : undefined,
    progress: typeof fm.progress === "number" ? fm.progress : undefined,
    rating: typeof fm.rating === "number" ? fm.rating : undefined,
    cover: typeof fm.cover === "string" ? fm.cover : undefined,
  };
}

function hasTaskTag(app: App, file: TFile): boolean {
  const cache = app.metadataCache.getFileCache(file);
  const tags = cache?.tags ?? [];
  if (tags.some((tag) => tag.tag.toLowerCase() === "#task")) {
    return true;
  }

  const frontmatter = cache?.frontmatter as FrontmatterShape | undefined;
  const fmTags = frontmatter?.tags;
  if (typeof fmTags === "string") {
    return fmTags
      .split(/\s+/)
      .some((value) => value.replace(/^#/, "").toLowerCase() === "task");
  }
  if (Array.isArray(fmTags)) {
    return fmTags.some((value) => {
      if (typeof value !== "string") return false;
      return value.replace(/^#/, "").toLowerCase() === "task";
    });
  }
  return false;
}

function toTask(app: App, file: TFile): DashboardTask | null {
  if (!hasTaskTag(app, file)) return null;

  const cache = app.metadataCache.getFileCache(file);
  const fm = (cache?.frontmatter ?? {}) as FrontmatterShape;
  const done = fm.Done === true || fm.done === true;
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

function computeDashboard(app: App): DashboardData {
  const now = new Date();
  const markdownFiles = app.vault.getMarkdownFiles();
  const books: BookRecord[] = [];
  const tasks: DashboardTask[] = [];
  const inboxNotes: TFile[] = [];

  for (const file of markdownFiles) {
    const cache = app.metadataCache.getFileCache(file);
    const fm = (cache?.frontmatter ?? {}) as FrontmatterShape;

    const maybeBook = normalizeBook(file, fm);
    if (maybeBook) books.push(maybeBook);

    const maybeTask = toTask(app, file);
    if (maybeTask) tasks.push(maybeTask);

    if (isInboxPath(file.path)) inboxNotes.push(file);
  }

  const openTasks = tasks.filter((task) => !task.done);
  const completedToday = tasks.filter((task) => {
    if (!task.done) return false;
    const cache = app.metadataCache.getFileCache(task.file);
    const fm = (cache?.frontmatter ?? {}) as FrontmatterShape;
    const fromFrontmatter = toDate(fm.modified);
    const modifiedAt = fromFrontmatter ?? new Date(task.file.stat.mtime);
    return isSameDay(modifiedAt, now);
  });

  const upcomingTasks = [...openTasks]
    .filter((task) => task.dueDate && task.dueDate.getTime() >= now.getTime())
    .sort((a, b) => (a.dueDate?.getTime() ?? 0) - (b.dueDate?.getTime() ?? 0))
    .slice(0, 6);

  const recentNotes = [...markdownFiles]
    .sort((a, b) => b.stat.mtime - a.stat.mtime)
    .slice(0, 8);

  const links: DashboardLink[] = HOME_LINKS.map((item) => {
    const found = app.metadataCache.getFirstLinkpathDest(item.path, "");
    return { label: item.label, file: found };
  });

  books.sort((a, b) => a.title.localeCompare(b.title));
  inboxNotes.sort((a, b) => b.stat.mtime - a.stat.mtime);

  return {
    books,
    inboxNotes,
    recentNotes,
    openTasks,
    completedToday,
    upcomingTasks,
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
