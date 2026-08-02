import * as React from "react";
import { App, TFile, WorkspaceLeaf, setIcon } from "obsidian";
import { useDashboard } from "../data/useDashboard";
import { useHabitsTracker } from "../data/useHabitsTracker";
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

function todayJournalKey(): string {
  const now = new Date();
  const yyyy = `${now.getFullYear()}`;
  const mm = `${now.getMonth() + 1}`.padStart(2, "0");
  const dd = `${now.getDate()}`.padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function FileChip({ file, onOpen }: { file: TFile; onOpen: (f: TFile) => void }) {
  return (
    <button className="smart-notes-chip" onClick={() => onOpen(file)}>
      {file.basename}
    </button>
  );
}

function HabitIcon({ icon, label }: { icon: string; label: string }) {
  const ref = React.useRef<HTMLSpanElement | null>(null);

  React.useEffect(() => {
    if (!ref.current) return;
    setIcon(ref.current, icon);
  }, [icon]);

  return <span ref={ref} className="smart-notes-habit-icon" title={label} />;
}

function StatusIcon({ status }: { status: boolean | null }) {
  const ref = React.useRef<HTMLSpanElement | null>(null);

  React.useEffect(() => {
    if (!ref.current) return;

    if (status === true) {
      setIcon(ref.current, "square-check-big");
      const svg = ref.current.querySelector("svg");
      if (svg) {
        svg.style.color = "var(--interactive-accent)";
        svg.style.strokeWidth = "2.2";
      }
      return;
    }

    if (status === false) {
      setIcon(ref.current, "square");
      const svg = ref.current.querySelector("svg");
      if (svg) {
        svg.style.color = "var(--text-faint)";
        svg.style.strokeWidth = "1.9";
      }
      return;
    }

    setIcon(ref.current, "minus");
    const svg = ref.current.querySelector("svg");
    if (svg) {
      svg.style.color = "var(--text-faint)";
      svg.style.strokeWidth = "2";
    }
  }, [status]);

  return <span ref={ref} className="smart-notes-status-icon" />;
}

export function HomeView({ app, settings: _settings, leaf }: HomeViewProps) {
  const data = useDashboard(app);
  const habits = useHabitsTracker(app, 7);
  const todayKey = todayJournalKey();

  const openFile = (file: TFile) => {
    leaf.openFile(file);
  };

  const scoreColor = (value: number): string => {
    if (value >= 80) return "#5ac080";
    if (value >= 60) return "#8db452";
    if (value >= 40) return "#dac05b";
    return "#da6969";
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
            <p className="smart-notes-muted">Sem compromissos para hoje ou próximos dias.</p>
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
          <div className="smart-notes-calendar-link-wrap">
            {data.links
              .filter((item) => item.label === "CalendarView")
              .map((item) => (
                <button
                  key={item.label}
                  className="smart-notes-link-button"
                  disabled={!item.file}
                  onClick={() => item.file && openFile(item.file)}
                >
                  CalendarView
                </button>
              ))}
          </div>
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

        <div className="smart-notes-panel smart-notes-panel-wide">
          <h2>Hábitos (últimos dias)</h2>
          {habits.days.length === 0 ? (
            <p className="smart-notes-muted">Nenhuma nota encontrada em journal/.</p>
          ) : (
            <div className="smart-notes-habits-wrap">
              <table className="smart-notes-habits-table">
                <thead>
                  <tr>
                    <th>Dia</th>
                    <th>%</th>
                    {habits.rows.map((row) => (
                      <th key={row.habit.key} className="smart-notes-habit-head" title={row.habit.label}>
                        <span className="smart-notes-habit-icon-badge">
                          <HabitIcon icon={row.habit.icon} label={row.habit.label} />
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {habits.days.map((day, dayIndex) => {
                    const isToday = day.file.basename === todayKey;
                    const statuses = habits.rows.map((row) => row.statuses[dayIndex]);
                    const filled = statuses.filter((status) => status !== null).length;
                    const done = statuses.filter((status) => status === true).length;
                    const completionPercent =
                      filled === 0 ? 0 : Math.round((done / filled) * 100);

                    return (
                      <tr
                        key={day.file.path}
                        className={isToday ? "smart-notes-habit-row-today" : undefined}
                      >
                        <td className={`smart-notes-habit-day${isToday ? " is-today" : ""}`}>
                          <button onClick={() => openFile(day.file)}>{day.shortLabel}</button>
                        </td>
                        <td
                          className="smart-notes-habit-score"
                          style={{ color: scoreColor(completionPercent) }}
                        >
                          {completionPercent}%
                        </td>
                        {statuses.map((status, statusIndex) => (
                          <td
                            key={`${day.file.path}-${habits.rows[statusIndex].habit.key}`}
                            className="smart-notes-habit-status-cell"
                          >
                            <button
                              type="button"
                              className="smart-notes-habit-status-button"
                              title={`Alternar ${habits.rows[statusIndex].habit.label}`}
                              onClick={() =>
                                habits.toggleStatus(
                                  day.file,
                                  habits.rows[statusIndex].habit.key
                                )
                              }
                            >
                              <StatusIcon status={status} />
                            </button>
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="smart-notes-panel">
          <h2>Livros</h2>
          <div className="smart-notes-link-list">
            {data.links
              .filter((item) =>
                ["Wishlist - Lista de livros católicos", "Biblioteca"].includes(
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
