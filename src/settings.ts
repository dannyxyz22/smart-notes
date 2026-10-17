import { IcsCalendarSource } from "./data/useIcsAgenda";

export type HabitsWindowPreset = "today" | "last3" | "week" | "month";

export interface SmartNotesSettings {
  agendaDaysAhead: number;
  icsCalendars: IcsCalendarSource[];
  habitsWindowPreset: HabitsWindowPreset;
  morningPrayerNotePath: string;
  googleCalendarWebhookUrl: string;
  googleCalendarApiKey: string;
  googleCalendarCalendarId: string;
}

// Intencionalmente vazio: URLs ICS privadas não devem ficar no código-fonte.
// Adicione seus calendários em Configurações → Smart Notes.
export const DEFAULT_ICS_CALENDARS: IcsCalendarSource[] = [];

export const DEFAULT_GOOGLE_CALENDAR_WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbxKRah1GVV9zQpkss-5T5YTN2XrHrMdNsCys_cDrEmHsdumzwTXlCoN2GmOsvY2HFvC/exec";

export const DEFAULT_SETTINGS: SmartNotesSettings = {
  agendaDaysAhead: 21,
  icsCalendars: DEFAULT_ICS_CALENDARS,
  habitsWindowPreset: "week",
  morningPrayerNotePath: "",
  googleCalendarWebhookUrl: DEFAULT_GOOGLE_CALENDAR_WEBHOOK_URL,
  googleCalendarApiKey: "",
  googleCalendarCalendarId: "primary",
};
