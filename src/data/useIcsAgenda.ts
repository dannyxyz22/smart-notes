import { requestUrl } from "obsidian";
import { useCallback, useEffect, useRef, useState } from "react";
import { RRule } from "rrule";

export interface IcsCalendarSource {
  name: string;
  url: string;
  color: string;
}

export interface IcsAgendaEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  calendarName: string;
  calendarColor: string;
}

export interface IcsAgendaState {
  events: IcsAgendaEvent[];
  loading: boolean;
  errors: string[];
  refresh: () => void;
}

const AGENDA_REFRESH_INTERVAL_MS = 5 * 60 * 1000;

interface ParsedDate {
  date: Date;
  allDay: boolean;
}

interface RawEvent {
  uid: string;
  summary: string;
  start: ParsedDate;
  end: ParsedDate | null;
  rrule: string | null;
  exdates: Date[];
}

interface ParsedProperty {
  name: string;
  params: Record<string, string>;
  value: string;
}

function unfoldIcs(text: string): string[] {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const result: string[] = [];

  for (const line of lines) {
    if ((line.startsWith(" ") || line.startsWith("\t")) && result.length > 0) {
      result[result.length - 1] += line.slice(1);
    } else {
      result.push(line);
    }
  }

  return result;
}

function parseProperty(line: string): ParsedProperty | null {
  const separator = line.indexOf(":");
  if (separator < 0) return null;

  const left = line.slice(0, separator);
  const value = line.slice(separator + 1);
  const parts = left.split(";");
  const name = parts[0].toUpperCase();
  const params: Record<string, string> = {};

  for (let i = 1; i < parts.length; i += 1) {
    const [k, v] = parts[i].split("=");
    if (!k || !v) continue;
    params[k.toUpperCase()] = v;
  }

  return { name, params, value };
}

function parseIcsDate(value: string, params: Record<string, string>): ParsedDate | null {
  const valueType = params.VALUE?.toUpperCase();
  const allDay = valueType === "DATE" || /^\d{8}$/.test(value);

  if (allDay) {
    const dayMatch = value.match(/^(\d{4})(\d{2})(\d{2})$/);
    if (!dayMatch) return null;

    const year = Number(dayMatch[1]);
    const month = Number(dayMatch[2]) - 1;
    const day = Number(dayMatch[3]);

    return {
      date: new Date(year, month, day, 0, 0, 0, 0),
      allDay: true,
    };
  }

  const dateMatch = value.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})?(Z)?$/);
  if (!dateMatch) return null;

  const year = Number(dateMatch[1]);
  const month = Number(dateMatch[2]) - 1;
  const day = Number(dateMatch[3]);
  const hour = Number(dateMatch[4]);
  const minute = Number(dateMatch[5]);
  const second = Number(dateMatch[6] ?? "0");
  const isUtc = dateMatch[7] === "Z";

  const date = isUtc
    ? new Date(Date.UTC(year, month, day, hour, minute, second))
    : new Date(year, month, day, hour, minute, second, 0);

  return { date, allDay: false };
}

function parseExdates(value: string, params: Record<string, string>): Date[] {
  const parts = value.split(",");
  const out: Date[] = [];

  for (const part of parts) {
    const parsed = parseIcsDate(part.trim(), params);
    if (parsed) out.push(parsed.date);
  }

  return out;
}

function parseEvents(icsText: string): RawEvent[] {
  const lines = unfoldIcs(icsText);
  const events: RawEvent[] = [];
  let current: {
    uid?: string;
    summary?: string;
    start?: ParsedDate;
    end?: ParsedDate;
    rrule?: string;
    exdates: Date[];
  } | null = null;

  for (const line of lines) {
    if (line === "BEGIN:VEVENT") {
      current = { exdates: [] };
      continue;
    }

    if (line === "END:VEVENT") {
      if (current?.start) {
        events.push({
          uid: current.uid ?? `${current.start.date.getTime()}`,
          summary: current.summary ?? "(Sem titulo)",
          start: current.start,
          end: current.end ?? null,
          rrule: current.rrule ?? null,
          exdates: current.exdates,
        });
      }
      current = null;
      continue;
    }

    if (!current) continue;
    const prop = parseProperty(line);
    if (!prop) continue;

    switch (prop.name) {
      case "UID":
        current.uid = prop.value;
        break;
      case "SUMMARY":
        current.summary = prop.value;
        break;
      case "DTSTART": {
        const start = parseIcsDate(prop.value, prop.params);
        if (start) current.start = start;
        break;
      }
      case "DTEND": {
        const end = parseIcsDate(prop.value, prop.params);
        if (end) current.end = end;
        break;
      }
      case "RRULE":
        current.rrule = prop.value;
        break;
      case "EXDATE":
        current.exdates.push(...parseExdates(prop.value, prop.params));
        break;
      default:
        break;
    }
  }

  return events;
}

function expandEvents(
  rawEvents: RawEvent[],
  calendarName: string,
  calendarColor: string,
  rangeStart: Date,
  rangeEnd: Date
): IcsAgendaEvent[] {
  const events: IcsAgendaEvent[] = [];

  for (const raw of rawEvents) {
    const durationMs = Math.max(
      0,
      (raw.end?.date.getTime() ?? raw.start.date.getTime()) - raw.start.date.getTime()
    );
    const occurrenceDurationMs = durationMs === 0 ? 60 * 60 * 1000 : durationMs;
    const exdateSet = new Set(raw.exdates.map((d) => d.getTime()));

    if (raw.rrule) {
      try {
        const opts = RRule.parseString(raw.rrule);
        const rule = new RRule({ ...opts, dtstart: raw.start.date });
        const between = rule.between(rangeStart, rangeEnd, true);

        for (const start of between) {
          if (exdateSet.has(start.getTime())) continue;
          const end = new Date(start.getTime() + occurrenceDurationMs);
          events.push({
            id: `${raw.uid}-${start.getTime()}`,
            title: raw.summary,
            start,
            end,
            allDay: raw.start.allDay,
            calendarName,
            calendarColor,
          });
        }
      } catch {
        // Ignora regra invalida sem travar o restante da agenda.
      }

      continue;
    }

    const start = raw.start.date;
    const end = raw.end?.date ?? new Date(start.getTime() + occurrenceDurationMs);

    // <= exclui eventos cujo DTEND cai exatamente em rangeStart (all-day de ontem).
    if (end.getTime() <= rangeStart.getTime()) continue;
    if (start.getTime() > rangeEnd.getTime()) continue;

    events.push({
      id: `${raw.uid}-${start.getTime()}`,
      title: raw.summary,
      start,
      end,
      allDay: raw.start.allDay,
      calendarName,
      calendarColor,
    });
  }

  return events;
}

async function fetchCalendar(
  source: IcsCalendarSource,
  rangeStart: Date,
  rangeEnd: Date
): Promise<{ events: IcsAgendaEvent[]; error?: string }> {
  try {
    const response = await requestUrl({ url: source.url, method: "GET" });
    const raw = parseEvents(response.text);
    const events = expandEvents(raw, source.name, source.color, rangeStart, rangeEnd);
    return { events };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    return { events: [], error: `${source.name}: ${message}` };
  }
}

function agendaEventSignature(event: IcsAgendaEvent): string {
  return [
    event.id,
    event.title,
    event.start.getTime(),
    event.end.getTime(),
    event.allDay ? "1" : "0",
    event.calendarName,
    event.calendarColor,
  ].join("|");
}

function sameAgendaEvents(left: IcsAgendaEvent[], right: IcsAgendaEvent[]): boolean {
  if (left.length !== right.length) return false;

  for (let index = 0; index < left.length; index += 1) {
    if (agendaEventSignature(left[index]) !== agendaEventSignature(right[index])) {
      return false;
    }
  }

  return true;
}

export function useIcsAgenda(
  sources: IcsCalendarSource[],
  daysAhead = 21
): IcsAgendaState {
  const [events, setEvents] = useState<IcsAgendaEvent[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const eventsRef = useRef<IcsAgendaEvent[]>([]);

  const refresh = useCallback(() => {
    let cancelled = false;

    const load = async () => {
      const now = new Date();
      const rangeStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
      const rangeEnd = new Date(rangeStart.getTime() + daysAhead * 24 * 60 * 60 * 1000);

      const results = await Promise.all(
        sources.map((source) => fetchCalendar(source, rangeStart, rangeEnd))
      );

      if (cancelled) return;

      const merged = results
        .flatMap((entry) => entry.events)
        .sort((a, b) => a.start.getTime() - b.start.getTime());

      const collectedErrors = results
        .map((entry) => entry.error)
        .filter((error): error is string => Boolean(error));

      const eventsChanged = !sameAgendaEvents(eventsRef.current, merged);

      if (eventsChanged) {
        eventsRef.current = merged;
        setEvents(merged);
        setErrors(collectedErrors);
      }

      if (loading) {
        setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [daysAhead, sources]);

  useEffect(() => {
    const cancel = refresh();
    const intervalId = window.setInterval(() => {
      refresh();
    }, AGENDA_REFRESH_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
      cancel();
    };
  }, [refresh]);

  return { events, loading, errors, refresh };
}
