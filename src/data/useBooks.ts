import { App, TFile } from "obsidian";
import { useEffect, useState, useCallback } from "react";
import { BookRecord } from "../types";
import { BookFrontmatter, toBookRecord } from "./bookRecord";

/**
 * Converte um TFile em um BookRecord, lendo o frontmatter já parseado
 * pelo metadataCache do Obsidian (sem reabrir o arquivo em disco).
 */
function readBookRecord(app: App, file: TFile): BookRecord | null {
  const cache = app.metadataCache.getFileCache(file);
  const frontmatter = cache?.frontmatter as BookFrontmatter | undefined;
  return frontmatter ? toBookRecord(file, frontmatter) : null;
}

function scanVault(app: App): BookRecord[] {
  const books: BookRecord[] = [];
  for (const file of app.vault.getMarkdownFiles()) {
    const record = readBookRecord(app, file);
    if (record) books.push(record);
  }
  return books.sort((a, b) => a.title.localeCompare(b.title));
}

/**
 * Mantém uma lista de BookRecord sincronizada com o vault.
 * Reagimos a três eventos do metadataCache/vault: quando o frontmatter
 * de um arquivo é resolvido/alterado, quando um arquivo é criado e
 * quando é removido. Isso evita varrer o vault inteiro a cada tecla —
 * só recalculamos quando algo relevante muda.
 */
export function useBooks(app: App): BookRecord[] {
  const [books, setBooks] = useState<BookRecord[]>(() => scanVault(app));

  const refresh = useCallback(() => {
    setBooks(scanVault(app));
  }, [app]);

  useEffect(() => {
    refresh();

    const onChanged = () => refresh();
    const onDeleted = () => refresh();

    app.metadataCache.on("changed", onChanged);
    app.vault.on("delete", onDeleted);
    app.vault.on("rename", onDeleted);

    return () => {
      app.metadataCache.off("changed", onChanged);
      app.vault.off("delete", onDeleted);
      app.vault.off("rename", onDeleted);
    };
  }, [app, refresh]);

  return books;
}
