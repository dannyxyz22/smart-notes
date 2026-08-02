import * as React from "react";
import { App, TFile, WorkspaceLeaf, setIcon } from "obsidian";
import { useDashboard } from "../data/useDashboard";
import { useHabitsTracker } from "../data/useHabitsTracker";
import { HabitsWindowPreset, SmartNotesSettings } from "../settings";

interface HomeViewProps {
  app: App;
  settings: SmartNotesSettings;
  leaf: WorkspaceLeaf;
  onHabitsWindowPresetChange: (preset: HabitsWindowPreset) => Promise<void>;
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

function isSameDay(left: Date, right: Date): boolean {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
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

function TitleIcon({ icon }: { icon: string }) {
  const ref = React.useRef<HTMLSpanElement | null>(null);

  React.useEffect(() => {
    if (!ref.current) return;
    setIcon(ref.current, icon);
  }, [icon]);

  return <span ref={ref} className="smart-notes-title-icon" aria-hidden="true" />;
}

export function HomeView({
  app,
  settings: _settings,
  leaf,
  onHabitsWindowPresetChange,
}: HomeViewProps) {
  const habitsWindowDays =
    _settings.habitsWindowPreset === "today"
      ? 1
      : _settings.habitsWindowPreset === "last3"
        ? 3
        : _settings.habitsWindowPreset === "month"
          ? 30
          : 7;
  const habitsWindowLabel =
    _settings.habitsWindowPreset === "today"
      ? "Hoje"
      : _settings.habitsWindowPreset === "last3"
        ? "Últimos 3 dias"
        : _settings.habitsWindowPreset === "month"
          ? "Último mês"
          : "Última semana";

  const data = useDashboard(app);
  const habits = useHabitsTracker(app, habitsWindowDays);
  const todayKey = todayJournalKey();
  const visibleUpcomingTasks = data.upcomingTasks.slice(0, 10);
  const hiddenUpcomingCount = Math.max(0, data.upcomingTasks.length - visibleUpcomingTasks.length);
  const visibleInboxNotes = data.inboxNotes.slice(0, 10);
  const hiddenInboxCount = Math.max(0, data.inboxNotes.length - visibleInboxNotes.length);
  const calendarViewLink = data.links.find((item) => item.label === "CalendarView") ?? null;
  const inboxProcessingLink = data.links.find((item) => item.label === "Inbox processing") ?? null;
  const bibliotecaLink = data.links.find((item) => item.label === "Biblioteca") ?? null;

  const openFile = (file: TFile) => {
    leaf.openFile(file);
  };

  const fileHref = (file: TFile | null | undefined): string => {
    if (!file) return "#";
    return `obsidian://open?vault=${encodeURIComponent(app.vault.getName())}&file=${encodeURIComponent(file.path)}`;
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
        <h1 className="smart-notes-home-title">
          <TitleIcon icon="home" />
          <span>Smart Notes Home</span>
        </h1>
      </div>

      <div className="smart-notes-home-stats">
        <div className="smart-notes-stat-card">
          <div className="smart-notes-stat-label">
            <a
              className={`smart-notes-stat-link${bibliotecaLink?.file ? "" : " is-disabled"}`}
              href={fileHref(bibliotecaLink?.file)}
              onClick={(event) => {
                if (!bibliotecaLink?.file) {
                  event.preventDefault();
                  return;
                }
                event.preventDefault();
                openFile(bibliotecaLink.file);
              }}
            >
              <TitleIcon icon="book-open" />
              <span>Livros</span>
            </a>
          </div>
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

      <div className="smart-notes-panel smart-notes-panel-wide smart-notes-habits-panel">
        <div className="smart-notes-panel-header-inline">
          <h2 className="smart-notes-title-with-icon">
            <TitleIcon icon="activity" />
            <span>Hábitos</span>
          </h2>
          <select
            className="smart-notes-panel-select"
            value={_settings.habitsWindowPreset}
            onChange={(event) => {
              const preset = event.target.value as HabitsWindowPreset;
              void onHabitsWindowPresetChange(preset);
            }}
            aria-label="Janela do card de hábitos"
            title="Janela do card de hábitos"
          >
            <option value="today">Hoje</option>
            <option value="last3">Últimos 3 dias</option>
            <option value="week">Última semana</option>
            <option value="month">Último mês</option>
          </select>
        </div>
        <p className="smart-notes-muted smart-notes-habits-caption">Exibindo: {habitsWindowLabel}</p>
        {habits.days.length === 0 ? (
          <p className="smart-notes-muted">Nenhuma nota encontrada em journal/.</p>
        ) : (
          <>
            <div className="smart-notes-habits-wrap smart-notes-habits-desktop">
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

            <div className="smart-notes-habits-mobile-wrap">
              <table className="smart-notes-habits-mobile-table">
                <thead>
                  <tr>
                    <th className="smart-notes-habits-mobile-corner" />
                    {habits.days.map((day) => {
                      const isToday = day.file.basename === todayKey;
                      return (
                        <th
                          key={day.file.path}
                          className={`smart-notes-habit-mobile-date-head${isToday ? " is-today" : ""}`}
                          title={day.file.basename}
                        >
                          <button type="button" onClick={() => openFile(day.file)}>
                            {day.shortLabel}
                          </button>
                        </th>
                      );
                    })}
                    <th className="smart-notes-habit-mobile-percent-head">%</th>
                  </tr>
                </thead>
                <tbody>
                  {habits.rows.map((row) => (
                    <tr key={row.habit.key}>
                      <td className="smart-notes-habit-mobile-icon-cell" title={row.habit.label}>
                        <span className="smart-notes-habit-icon-badge">
                          <HabitIcon icon={row.habit.icon} label={row.habit.label} />
                        </span>
                      </td>
                      {habits.days.map((day, dayIndex) => {
                        const isToday = day.file.basename === todayKey;
                        const status = row.statuses[dayIndex];
                        return (
                          <td
                            key={`${row.habit.key}-${day.file.path}`}
                            className={`smart-notes-habit-mobile-status-cell${isToday ? " is-today" : ""}`}
                          >
                            <button
                              type="button"
                              className="smart-notes-habit-mobile-toggle"
                              title={`Alternar ${row.habit.label} em ${day.shortLabel}`}
                              onClick={() => habits.toggleStatus(day.file, row.habit.key)}
                            >
                              <StatusIcon status={status} />
                            </button>
                          </td>
                        );
                      })}
                      <td
                        className="smart-notes-habit-mobile-percent"
                        style={{ color: scoreColor(row.completionPercent) }}
                      >
                        {row.completionPercent}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <div className="smart-notes-home-grid">
        <div className="smart-notes-panel">
          <div className="smart-notes-panel-header-inline">
            <h2 className="smart-notes-title-with-icon">
              <TitleIcon icon="list-todo" />
              <span>Tarefas</span>
            </h2>
            <button
              className="smart-notes-panel-action-link"
              disabled={!calendarViewLink?.file}
              onClick={() => calendarViewLink?.file && openFile(calendarViewLink.file)}
            >
              CalendarView
            </button>
          </div>
          {visibleUpcomingTasks.length === 0 ? (
            <p className="smart-notes-muted">Sem tarefas abertas com Do date.</p>
          ) : (
            <ul className="smart-notes-list">
              {visibleUpcomingTasks.map((task) => {
                const isTodayTask = task.dueDate ? isSameDay(task.dueDate, new Date()) : false;

                return (
                <li
                  key={task.file.path}
                  className={isTodayTask ? "smart-notes-task-today" : undefined}
                >
                  <button onClick={() => openFile(task.file)}>{task.title}</button>
                  <span className={isTodayTask ? "smart-notes-task-today-date" : undefined}>
                    {task.dueDate ? formatDate(task.dueDate) : "-"}
                  </span>
                </li>
              );})}
            </ul>
          )}
          {hiddenUpcomingCount > 0 ? (
            <p className="smart-notes-muted smart-notes-hidden-count">
              +{hiddenUpcomingCount} tarefa(s) não exibida(s)
            </p>
          ) : null}
        </div>

        <div className="smart-notes-panel">
          <h2 className="smart-notes-title-with-icon">
            <TitleIcon icon="check-check" />
            <span>Finalizadas hoje</span>
          </h2>
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

        <div className="smart-notes-panel">
          <div className="smart-notes-panel-header-inline">
            <h2 className="smart-notes-title-with-icon">
              <TitleIcon icon="inbox" />
              <span>Inbox e triagem rápida</span>
            </h2>
            <button
              className="smart-notes-panel-action-link"
              disabled={!inboxProcessingLink?.file}
              onClick={() => inboxProcessingLink?.file && openFile(inboxProcessingLink.file)}
            >
              Inbox processing
            </button>
          </div>
          {data.inboxNotes.length === 0 ? (
            <p className="smart-notes-muted">A pasta inbox está vazia.</p>
          ) : (
            <ul className="smart-notes-list">
              {visibleInboxNotes.map((file) => (
                <li key={file.path}>
                  <button onClick={() => openFile(file)}>{file.basename}</button>
                  <span>{formatDateTime(file.stat.mtime)}</span>
                </li>
              ))}
            </ul>
          )}
          {hiddenInboxCount > 0 ? (
            <p className="smart-notes-muted smart-notes-hidden-count">
              +{hiddenInboxCount} tarefa(s) não exibida(s)
            </p>
          ) : null}
        </div>

        <div className="smart-notes-panel smart-notes-panel-wide">
          <h2 className="smart-notes-title-with-icon">
            <TitleIcon icon="clock-3" />
            <span>Notas recentes</span>
          </h2>
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
