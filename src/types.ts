import { TFile } from "obsidian";

/**
 * Representa uma nota do tipo "book" já normalizada a partir do frontmatter.
 * O arquivo Markdown continua sendo a fonte da verdade — este objeto é
 * apenas uma projeção em memória, recalculada sempre que o vault muda.
 */
export interface BookRecord {
  file: TFile;
  title: string;
  author?: string;
  status?: string;
  progress?: number; // 0-100
  rating?: number; // 0-5
  cover?: string;
}

export const BOOK_TYPE = "book";
