import * as React from "react";
import { App, Notice, TFile, WorkspaceLeaf, setIcon } from "obsidian";
import { useDashboard } from "../data/useDashboard";
import { useHabitsTracker } from "../data/useHabitsTracker";
import { getSaintOfDay } from "../data/saints";
import { HabitsWindowPreset, SmartNotesSettings } from "../settings";

interface HomeViewProps {
  app: App;
  settings: SmartNotesSettings;
  leaf: WorkspaceLeaf;
  onHabitsWindowPresetChange: (preset: HabitsWindowPreset) => Promise<void>;
}

interface HabitDayProgress {
  done: number;
  total: number;
  percent: number;
}

interface TemplaterRuntime {
  create_new_note_from_template: (
    templateFile: TFile,
    targetFolder?: undefined,
    fileName?: string,
    openNewNote?: boolean
  ) => Promise<TFile | undefined>;
}

interface TemplaterPluginInstance {
  templater?: TemplaterRuntime;
}

interface CommunityPluginRegistry {
  getPlugin?: (id: string) => TemplaterPluginInstance | null;
  plugins?: Record<string, TemplaterPluginInstance | undefined>;
}

const TASK_TEMPLATE_PATH = "templates/Tarefa.md";

function calculateHabitDayProgress(
  statuses: Array<boolean | null>
): HabitDayProgress {
  const total = statuses.filter((status) => status !== null).length;
  const done = statuses.filter((status) => status === true).length;
  return {
    done,
    total,
    percent: total === 0 ? 0 : Math.round((done / total) * 100),
  };
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

function formatSaintDate(date: Date): string {
  const formatted = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

function useCurrentLocalDate(): Date {
  const [currentDate, setCurrentDate] = React.useState(() => new Date());

  React.useEffect(() => {
    let timeoutId: number | null = null;

    const scheduleNextDay = () => {
      const now = new Date();
      const nextDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0,
        0,
        1,
        0
      );
      timeoutId = window.setTimeout(() => {
        setCurrentDate(new Date());
        scheduleNextDay();
      }, Math.max(1_000, nextDay.getTime() - now.getTime()));
    };

    scheduleNextDay();
    return () => {
      if (timeoutId !== null) window.clearTimeout(timeoutId);
    };
  }, []);

  return currentDate;
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

function calendarDaysBetween(later: Date, earlier: Date): number {
  const laterUtc = Date.UTC(later.getFullYear(), later.getMonth(), later.getDate());
  const earlierUtc = Date.UTC(
    earlier.getFullYear(),
    earlier.getMonth(),
    earlier.getDate()
  );
  return Math.max(0, Math.floor((laterUtc - earlierUtc) / 86_400_000));
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
  const [creatingTask, setCreatingTask] = React.useState(false);
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
  const currentDate = useCurrentLocalDate();
  const saintOfDay = getSaintOfDay(currentDate);
  const todayKey = todayJournalKey();
  const habitDayProgress = habits.days.map((_, dayIndex) =>
    calculateHabitDayProgress(
      habits.rows.map((row) => row.statuses[dayIndex])
    )
  );
  const todayHabitDayIndex = habits.days.findIndex(
    (day) => day.file.basename === todayKey
  );
  const todayHabitProgress =
    todayHabitDayIndex >= 0 ? habitDayProgress[todayHabitDayIndex] : null;
  const visibleUpcomingTasks = data.upcomingTasks.slice(0, 10);
  const hiddenUpcomingCount = Math.max(0, data.upcomingTasks.length - visibleUpcomingTasks.length);
  const visibleInboxNotes = data.inboxNotes.slice(0, 10);
  const hiddenInboxCount = Math.max(0, data.inboxNotes.length - visibleInboxNotes.length);
  const calendarViewLink = data.links.find((item) => item.label === "CalendarView") ?? null;
  const inboxProcessingLink = data.links.find((item) => item.label === "Inbox processing") ?? null;
  const bibliotecaLink = data.links.find((item) => item.label === "Biblioteca") ?? null;
  const confissoesLink = data.links.find((item) => item.label === "Confissões") ?? null;
  const daysSinceLastConfession = data.lastConfession
    ? calendarDaysBetween(currentDate, data.lastConfession.date)
    : null;

  const openFile = (file: TFile) => {
    leaf.openFile(file);
  };

  const createTaskFromTemplate = async () => {
    if (creatingTask) return;

    const template = app.vault.getAbstractFileByPath(TASK_TEMPLATE_PATH);
    if (!(template instanceof TFile)) {
      new Notice(`Template não encontrado: ${TASK_TEMPLATE_PATH}`);
      return;
    }

    const pluginRegistry = (app as App & { plugins?: CommunityPluginRegistry }).plugins;
    const templaterPlugin =
      pluginRegistry?.getPlugin?.("templater-obsidian") ??
      pluginRegistry?.plugins?.["templater-obsidian"];
    const templater = templaterPlugin?.templater;

    if (!templater?.create_new_note_from_template) {
      new Notice("Ative o plugin Templater para criar uma nova tarefa.");
      return;
    }

    setCreatingTask(true);
    try {
      await templater.create_new_note_from_template(
        template,
        undefined,
        undefined,
        true
      );
    } catch (error) {
      console.error("Smart Notes: erro ao criar tarefa com Templater", error);
      new Notice("Não foi possível criar a tarefa com o Templater.");
    } finally {
      setCreatingTask(false);
    }
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

      {saintOfDay ? (
        <section className="smart-notes-saint-card" aria-labelledby="smart-notes-saint-name">
          <div className="smart-notes-saint-icon">
            <TitleIcon icon="sparkles" />
          </div>
          <div className="smart-notes-saint-content">
            <div className="smart-notes-saint-heading">
              <span className="smart-notes-saint-label">Santo do Dia</span>
              <span className="smart-notes-saint-date">{formatSaintDate(currentDate)}</span>
            </div>
            <h2 id="smart-notes-saint-name">{saintOfDay.name}</h2>
          </div>
          <a
            className="smart-notes-saint-link external-link"
            href={saintOfDay.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Conheça a história de ${saintOfDay.name} no Vatican News`}
          >
            Conheça sua história
          </a>
        </section>
      ) : null}

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
        <div className="smart-notes-stat-card smart-notes-task-stat-card">
          <div className="smart-notes-stat-label">Tarefas abertas</div>
          <div className="smart-notes-stat-main-row">
            <div className="smart-notes-stat-value">{data.openTasks.length}</div>
            <button
              type="button"
              className="smart-notes-stat-action"
              onClick={() => void createTaskFromTemplate()}
              disabled={creatingTask}
              aria-label="Criar nova tarefa com o template Tarefa"
              title="Criar nova tarefa com o Templater"
            >
              <TitleIcon icon="plus" />
              <span>{creatingTask ? "Criando…" : "Nova"}</span>
            </button>
          </div>
        </div>
        <div className="smart-notes-stat-card">
          <div className="smart-notes-stat-label">Finalizadas hoje</div>
          <div className="smart-notes-stat-value">{data.completedToday.length}</div>
        </div>
        <div className="smart-notes-stat-card">
          <div className="smart-notes-stat-label">Inbox</div>
          <div className="smart-notes-stat-value">{data.inboxNotes.length}</div>
        </div>
        <div className="smart-notes-stat-card smart-notes-confession-stat-card">
          <div className="smart-notes-stat-label">
            <a
              className={`smart-notes-stat-link${confissoesLink?.file ? "" : " is-disabled"}`}
              href={fileHref(confissoesLink?.file)}
              onClick={(event) => {
                if (!confissoesLink?.file) {
                  event.preventDefault();
                  return;
                }
                event.preventDefault();
                openFile(confissoesLink.file);
              }}
            >
              <TitleIcon icon="church" />
              <span>Desde a última confissão</span>
            </a>
          </div>
          <div className="smart-notes-stat-value">
            {daysSinceLastConfession ?? "—"}
            {daysSinceLastConfession !== null ? (
              <span className="smart-notes-stat-unit">
                {daysSinceLastConfession === 1 ? " dia" : " dias"}
              </span>
            ) : null}
          </div>
          {!data.lastConfession ? (
            <div className="smart-notes-confession-empty">Nenhuma data encontrada</div>
          ) : null}
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
        <div className="smart-notes-habits-mobile-summary">
          <div className="smart-notes-habits-mobile-summary-heading">
            <span>Progresso de hoje</span>
            <span className="smart-notes-habits-mobile-summary-count">
              {todayHabitProgress
                ? `${todayHabitProgress.done}/${todayHabitProgress.total} concluídos`
                : "Sem registro de hoje"}
            </span>
          </div>
          <div
            className="smart-notes-habit-progress smart-notes-habits-mobile-today-progress"
            role="progressbar"
            aria-label="Hábitos concluídos hoje"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={todayHabitProgress?.percent ?? 0}
            aria-valuetext={
              todayHabitProgress
                ? `${todayHabitProgress.done} de ${todayHabitProgress.total} hábitos concluídos`
                : "Sem registro de hoje"
            }
          >
            <span
              className="smart-notes-habit-progress-fill"
              style={{
                width: `${todayHabitProgress?.percent ?? 0}%`,
                backgroundColor: scoreColor(todayHabitProgress?.percent ?? 0),
              }}
            />
            <span className="smart-notes-habit-progress-label">
              {todayHabitProgress?.percent ?? 0}%
            </span>
          </div>
        </div>
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
                  const progress = habitDayProgress[dayIndex];

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
                      >
                        <div
                          className="smart-notes-habit-progress"
                          role="progressbar"
                          aria-label={`Atividades concluídas em ${day.shortLabel}`}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-valuenow={progress.percent}
                          title={`${progress.percent}% das atividades concluídas`}
                        >
                          <span
                            className="smart-notes-habit-progress-fill"
                            style={{
                              width: `${progress.percent}%`,
                              backgroundColor: scoreColor(progress.percent),
                            }}
                          />
                          <span className="smart-notes-habit-progress-label">
                            {progress.percent}%
                          </span>
                        </div>
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
                    {habits.days.map((day, dayIndex) => {
                      const isToday = day.file.basename === todayKey;
                      const progress = habitDayProgress[dayIndex];
                      return (
                        <th
                          key={day.file.path}
                          className={`smart-notes-habit-mobile-date-head${isToday ? " is-today" : ""}`}
                          title={day.file.basename}
                        >
                          <button type="button" onClick={() => openFile(day.file)}>
                            <span className="smart-notes-habit-mobile-date-label">
                              {day.shortLabel}
                            </span>
                          </button>
                          <span
                            className="smart-notes-habit-mobile-day-ring"
                            role="progressbar"
                            aria-label={`Hábitos concluídos em ${day.shortLabel}`}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-valuenow={progress.percent}
                            aria-valuetext={`${progress.done} de ${progress.total} hábitos concluídos`}
                            style={{ color: scoreColor(progress.percent) }}
                          >
                            <svg viewBox="0 0 36 36" aria-hidden="true">
                              <circle
                                className="smart-notes-habit-mobile-day-ring-track"
                                cx="18"
                                cy="18"
                                r="15"
                              />
                              <circle
                                className="smart-notes-habit-mobile-day-ring-value"
                                cx="18"
                                cy="18"
                                r="15"
                                pathLength="100"
                                strokeDasharray={`${progress.percent} 100`}
                              />
                            </svg>
                            <span>{progress.percent}%</span>
                          </span>
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
