import { TFile } from "obsidian";
import { BookRecord, BOOK_TYPE } from "../types";

export type BookFrontmatter = Record<string, unknown>;

/**
 * Obsidian/YAML pode representar `type` como um valor simples ou uma lista.
 * Aceitamos as duas formas para que `type: book` e `type: [book]` tenham o
 * mesmo significado.
 */
export function hasBookType(value: unknown): boolean {
  const values = Array.isArray(value) ? value : [value];
  return values.some(
    (item) =>
      typeof item === "string" &&
      item.trim().toLocaleLowerCase() === BOOK_TYPE,
  );
}

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

export function toBookRecord(
  file: TFile,
  frontmatter: BookFrontmatter,
): BookRecord | null {
  if (!hasBookType(frontmatter.type)) return null;

  return {
    file,
    title: optionalString(frontmatter.title) ?? file.basename,
    author:
      optionalString(frontmatter.author) ?? optionalString(frontmatter.autor),
    status: optionalString(frontmatter.status),
    progress:
      typeof frontmatter.progress === "number"
        ? frontmatter.progress
        : undefined,
    rating:
      typeof frontmatter.rating === "number" ? frontmatter.rating : undefined,
    cover:
      optionalString(frontmatter.cover) ?? optionalString(frontmatter.capa),
  };
}
