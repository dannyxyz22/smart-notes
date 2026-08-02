import * as React from "react";
import { App, TFile, WorkspaceLeaf } from "obsidian";
import { useDashboard } from "../data/useDashboard";
import { IcsCalendarSource, IcsAgendaEvent, useIcsAgenda } from "../data/useIcsAgenda";
import { SmartNotesSettings } from "../settings";

interface HomeViewProps {
  app: App;
  settings: SmartNotesSettings;
  leaf: WorkspaceLeaf;
}

const MONTHS_PT = [
  "JAN.",
  "FEV.",
  "MAR.",
  "ABR.",
  "MAI.",
  "JUN.",
  "JUL.",
  "AGO.",
  "SET.",
  "OUT.",
  "NOV.",
  "DEZ.",
];

const WEEKDAYS_PT = ["DOM.", "SEG.", "TER.", "QUA.", "QUI.", "SEX.", "SAB."];

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

function isTodayDate(date: Date): boolean {
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

function formatAgendaDayLabel(date: Date): string {
  return `${MONTHS_PT[date.getMonth()]}, ${WEEKDAYS_PT[date.getDay()]}`;
}

function formatAgendaTime(event: IcsAgendaEvent): string {
  if (event.allDay) return "Dia todo";

  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(event.start);
}

function groupEventsByDay(events: IcsAgendaEvent[]): Array<{ dayKey: string; day: Date; events: IcsAgendaEvent[] }> {
  const grouped = new Map<string, { day: Date; events: IcsAgendaEvent[] }>();

  for (const event of events) {
    const keyDate = new Date(
      event.start.getFullYear(),
      event.start.getMonth(),
      event.start.getDate(),
      0,
      0,
      0,
      0
    );
    const key = keyDate.toISOString();
    const existing = grouped.get(key);
    if (existing) {
      existing.events.push(event);
      continue;
    }

    grouped.set(key, { day: keyDate, events: [event] });
  }

  return [...grouped.entries()]
    .sort((a, b) => a[1].day.getTime() - b[1].day.getTime())
    .map(([dayKey, value]) => ({
      dayKey,
      day: value.day,
      events: value.events.sort((left, right) => left.start.getTime() - right.start.getTime()),
    }));
}

function FileChip({ file, onOpen }: { file: TFile; onOpen: (f: TFile) => void }) {
  return (
    <button className="smart-notes-chip" onClick={() => onOpen(file)}>
      {file.basename}
    </button>
  );
}

function normalizeCalendars(cals: IcsCalendarSource[]): IcsCalendarSource[] {
  return cals.filter((cal) => cal.name.trim().length > 0 && cal.url.trim().length > 0);
}

export function HomeView({ app, settings, leaf }: HomeViewProps) {
  const data = useDashboard(app);
  const normalizedCalendars = React.useMemo(
    () => normalizeCalendars(settings.icsCalendars),
    [settings.icsCalendars]
  );
  const agenda = useIcsAgenda(normalizedCalendars, settings.agendaDaysAhead);
  const dayGroups = groupEventsByDay(agenda.events);

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
        <div className="smart-notes-panel smart-notes-panel-wide">
          <div className="smart-notes-panel-header-inline">
            <h2>Agenda (ICS)</h2>
            <button className="smart-notes-link-button" onClick={agenda.refresh}>
              Atualizar
            </button>
          </div>

          {agenda.loading ? (
            <p className="smart-notes-muted">Carregando compromissos...</p>
          ) : dayGroups.length === 0 ? (
            <p className="smart-notes-muted">
              Nenhum compromisso encontrado nos proximos dias.
            </p>
          ) : (
            <div className="smart-notes-agenda-list">
              {dayGroups.map((group) => (
                <div key={group.dayKey} className="smart-notes-agenda-day">
                  <div className="smart-notes-agenda-day-header">
                    <div
                      className={`smart-notes-agenda-day-num${isTodayDate(group.day) ? " is-today" : ""}`}
                    >
                      {group.day.getDate()}
                    </div>
                    <div className="smart-notes-agenda-day-label">
                      {formatAgendaDayLabel(group.day)}
                    </div>
                  </div>
                  <div className="smart-notes-agenda-day-events">
                    {group.events.map((event) => (
                      <div key={event.id} className="smart-notes-agenda-item">
                        <div
                          className="smart-notes-agenda-dot"
                          style={{ backgroundColor: event.calendarColor }}
                        />
                        <div className="smart-notes-agenda-time">{formatAgendaTime(event)}</div>
                        <div className="smart-notes-agenda-title">{event.title}</div>
                        <div className="smart-notes-agenda-calendar">{event.calendarName}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {agenda.errors.length > 0 && (
            <div className="smart-notes-calendar-help">
              {agenda.errors.map((error) => (
                <div key={error}>{error}</div>
              ))}
            </div>
          )}
        </div>

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
