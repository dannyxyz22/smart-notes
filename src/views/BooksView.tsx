import * as React from "react";
import { App } from "obsidian";
import { useMemo, useState } from "react";
import { useBooks } from "../data/useBooks";
import { BookCard } from "./BookCard";
import { BookRecord } from "../types";

interface BooksViewProps {
  app: App;
}

type SortKey = "title" | "author" | "rating" | "progress";

export function BooksView({ app }: BooksViewProps) {
  const books = useBooks(app);
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("title");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = books;
    if (q) {
      list = list.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author?.toLowerCase().includes(q)
      );
    }
    return [...list].sort((a, b) => {
      switch (sortKey) {
        case "author":
          return (a.author ?? "").localeCompare(b.author ?? "");
        case "rating":
          return (b.rating ?? 0) - (a.rating ?? 0);
        case "progress":
          return (b.progress ?? 0) - (a.progress ?? 0);
        default:
          return a.title.localeCompare(b.title);
      }
    });
  }, [books, query, sortKey]);

  const openBook = (book: BookRecord) => {
    app.workspace.getLeaf(false).openFile(book.file);
  };

  return (
    <div className="smart-notes-books-view">
      <div className="smart-notes-toolbar">
        <input
          type="text"
          placeholder="Buscar por título ou autor..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="smart-notes-search"
        />
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as SortKey)}
          className="smart-notes-sort"
        >
          <option value="title">Título</option>
          <option value="author">Autor</option>
          <option value="rating">Avaliação</option>
          <option value="progress">Progresso</option>
        </select>
        <span className="smart-notes-count">{filtered.length} livro(s)</span>
      </div>

      {filtered.length === 0 ? (
        <div className="smart-notes-empty">
          Nenhuma nota com <code>type: book</code> encontrada no vault.
        </div>
      ) : (
        <div className="smart-notes-grid">
          {filtered.map((book) => (
            <BookCard key={book.file.path} book={book} onOpen={openBook} />
          ))}
        </div>
      )}
    </div>
  );
}
