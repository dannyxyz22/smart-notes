import * as React from "react";
import { App, TFile, WorkspaceLeaf } from "obsidian";
import { useDashboard } from "../data/useDashboard";
import { SmartNotesSettings } from "../settings";

interface HomeViewProps {
  app: App;
  settings: SmartNotesSettings;
  leaf: WorkspaceLeaf;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function formatDateTime(ts: number): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(ts));
}

function FileChip({ file, onOpen }: { file: TFile; onOpen: (f: TFile) => void }) {
  return (
    <button className="smart-notes-chip" onClick={() => onOpen(file)}>
      {file.basename}
    </button>
  );
}

export function HomeView({ app, settings: _settings, leaf }: HomeViewProps) {
  const data = useDashboard(app);

  const openFile = (file: TFile) => {
    leaf.openFile(file);
  };

  return (
    <div className="smart-notes-home-view">
      <div className="smart-notes-home-header">
        <h1>Smart Notes Home</h1>
        <p>Dashboard do vault inspirado no Home.md, agora como plugin.</p>
      </div>

      <div className="smart-notes-home-stats">
        <div className="smart-notes-stat-card">
          <div className="smart-notes-stat-label">Livros</div>
          <div className="smart-notes-stat-value">{data.books.length}</div>
        </div>
        <div className="smart-notes-stat-card">
          <div className="smart-notes-stat-label">Tarefas abertas</div>
          <div className="smart-notes-stat-value">{data.openTasks.length}</div>
        </div>
        <div className="smart-notes-stat-card">
          <div className="smart-notes-stat-label">Finalizadas hoje</div>
          <div className="smart-notes-stat-value">{data.completedToday.length}</div>
        </div>
        <div className="smart-notes-stat-card">
          <div className="smart-notes-stat-label">Inbox</div>
          <div className="smart-notes-stat-value">{data.inboxNotes.length}</div>
        </div>
      </div>

      <div className="smart-notes-home-grid">
        <div className="smart-notes-panel">
          <h2>Proximos compromissos</h2>
          {data.upcomingTasks.length === 0 ? (
            <p className="smart-notes-muted">Sem compromissos futuros com Do date.</p>
          ) : (
            <ul className="smart-notes-list">
              {data.upcomingTasks.map((task) => (
                <li key={task.file.path}>
                  <button onClick={() => openFile(task.file)}>{task.title}</button>
                  <span>{task.dueDate ? formatDate(task.dueDate) : "-"}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="smart-notes-panel">
          <h2>Finalizadas hoje</h2>
          {data.completedToday.length === 0 ? (
            <p className="smart-notes-muted">Nenhuma tarefa finalizada hoje ainda.</p>
          ) : (
            <ul className="smart-notes-list">
              {data.completedToday.slice(0, 8).map((task) => (
                <li key={task.file.path}>
                  <button onClick={() => openFile(task.file)}>{task.title}</button>
                  <span>{formatDateTime(task.file.stat.mtime)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="smart-notes-panel smart-notes-panel-wide">
          <h2>Inbox e triagem rapida</h2>
          {data.inboxNotes.length === 0 ? (
            <p className="smart-notes-muted">A pasta inbox esta vazia.</p>
          ) : (
            <div className="smart-notes-chip-wrap">
              {data.inboxNotes.slice(0, 20).map((file) => (
                <FileChip key={file.path} file={file} onOpen={openFile} />
              ))}
            </div>
          )}
        </div>

        <div className="smart-notes-panel">
          <h2>Pessoas e habitos</h2>
          <div className="smart-notes-link-list">
            {data.links
              .filter((item) =>
                ["Pessoas", "Journal", "CalendarView"].includes(item.label)
              )
              .map((item) => (
                <button
                  key={item.label}
                  className="smart-notes-link-button"
                  disabled={!item.file}
                  onClick={() => item.file && openFile(item.file)}
                >
                  {item.label}
                </button>
              ))}
          </div>
        </div>

        <div className="smart-notes-panel">
          <h2>Livros</h2>
          <div className="smart-notes-link-list">
            {data.links
              .filter((item) =>
                ["Wishlist - Lista de livros catolicos", "Biblioteca"].includes(
                  item.label
                )
              )
              .map((item) => (
                <button
                  key={item.label}
                  className="smart-notes-link-button"
                  disabled={!item.file}
                  onClick={() => item.file && openFile(item.file)}
                >
                  {item.label}
                </button>
              ))}
          </div>
        </div>

        <div className="smart-notes-panel smart-notes-panel-wide">
          <h2>Notas recentes</h2>
          <ul className="smart-notes-list">
            {data.recentNotes.map((note) => (
              <li key={note.path}>
                <button onClick={() => openFile(note)}>{note.path}</button>
                <span>{formatDateTime(note.stat.mtime)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
