import { IcsCalendarSource } from "./data/useIcsAgenda";

export type HabitsWindowPreset = "today" | "last3" | "week" | "month";

export interface SmartNotesSettings {
  agendaDaysAhead: number;
  icsCalendars: IcsCalendarSource[];
  habitsWindowPreset: HabitsWindowPreset;
}

// Intencionalmente vazio: URLs ICS privadas não devem ficar no código-fonte.
// Adicione seus calendários em Configurações → Smart Notes.
export const DEFAULT_ICS_CALENDARS: IcsCalendarSource[] = [];

export const DEFAULT_SETTINGS: SmartNotesSettings = {
  agendaDaysAhead: 21,
  icsCalendars: DEFAULT_ICS_CALENDARS,
  habitsWindowPreset: "week",
};
