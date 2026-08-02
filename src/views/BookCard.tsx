import * as React from "react";
import { BookRecord } from "../types";

interface BookCardProps {
  book: BookRecord;
  onOpen: (book: BookRecord) => void;
}

function Stars({ rating }: { rating?: number }) {
  if (!rating) return null;
  const full = Math.round(rating);
  return (
    <div className="smart-notes-stars" aria-label={`Avaliação ${rating} de 5`}>
      {"★".repeat(full)}
      {"☆".repeat(Math.max(0, 5 - full))}
    </div>
  );
}

export function BookCard({ book, onOpen }: BookCardProps) {
  return (
    <div
      className="smart-notes-book-card"
      onClick={() => onOpen(book)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onOpen(book);
      }}
    >
      <div className="smart-notes-book-cover">
        {book.cover ? (
          <img src={book.cover} alt={book.title} />
        ) : (
          <div className="smart-notes-book-cover-placeholder">📕</div>
        )}
      </div>
      <div className="smart-notes-book-info">
        <div className="smart-notes-book-title">{book.title}</div>
        {book.author && (
          <div className="smart-notes-book-author">{book.author}</div>
        )}
        {typeof book.progress === "number" && (
          <div className="smart-notes-progress-track">
            <div
              className="smart-notes-progress-fill"
              style={{ width: `${Math.min(100, Math.max(0, book.progress))}%` }}
            />
          </div>
        )}
        <Stars rating={book.rating} />
        {book.status && (
          <div className="smart-notes-book-status">{book.status}</div>
        )}
      </div>
    </div>
  );
}
