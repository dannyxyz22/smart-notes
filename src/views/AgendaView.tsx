import * as React from "react";
import { IcsAgendaEvent, useIcsAgenda } from "../data/useIcsAgenda";
import { SmartNotesSettings } from "../settings";

interface AgendaViewProps {
  settings: SmartNotesSettings;
}

const MONTHS_PT = [
  "JAN.", "FEV.", "MAR.", "ABR.", "MAI.", "JUN.",
  "JUL.", "AGO.", "SET.", "OUT.", "NOV.", "DEZ.",
];
const WEEKDAYS_PT = ["DOM.", "SEG.", "TER.", "QUA.", "QUI.", "SEX.", "SAB."];

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

function groupEventsByDay(
  events: IcsAgendaEvent[]
): Array<{ dayKey: string; day: Date; events: IcsAgendaEvent[] }> {
  const grouped = new Map<string, { day: Date; events: IcsAgendaEvent[] }>();

  for (const event of events) {
    const keyDate = new Date(
      event.start.getFullYear(), event.start.getMonth(), event.start.getDate(),
      0, 0, 0, 0
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
      events: value.events.sort((l, r) => l.start.getTime() - r.start.getTime()),
    }));
}

function normalizeCalendars(settings: SmartNotesSettings) {
  return settings.icsCalendars.filter(
    (cal) => cal.name.trim().length > 0 && cal.url.trim().length > 0
  );
}

export function AgendaView({ settings }: AgendaViewProps) {
  const sources = React.useMemo(
    () => normalizeCalendars(settings),
    [settings.icsCalendars]
  );
  const agenda = useIcsAgenda(sources, settings.agendaDaysAhead);
  const dayGroups = groupEventsByDay(agenda.events);

  return (
    <div className="smart-notes-agenda-sidebar">
      <div className="smart-notes-panel-header-inline">
        <span className="smart-notes-agenda-sidebar-title">Agenda</span>
        <button className="smart-notes-link-button" onClick={agenda.refresh}>
          Atualizar
        </button>
      </div>

      {agenda.loading ? (
        <p className="smart-notes-muted">Carregando...</p>
      ) : dayGroups.length === 0 ? (
        <p className="smart-notes-muted">Nenhum compromisso encontrado.</p>
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
  );
}
