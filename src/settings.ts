import { IcsCalendarSource } from "./data/useIcsAgenda";

export interface SmartNotesSettings {
  agendaDaysAhead: number;
  icsCalendars: IcsCalendarSource[];
}

export const DEFAULT_ICS_CALENDARS: IcsCalendarSource[] = [
  {
    name: "Festas Liturgicas",
    color: "#009688",
    url: "https://calendar.google.com/calendar/ical/3a194e97711b897898b06edf7fdb3d78c19327ef94f319ec862a64a33cdf7683%40group.calendar.google.com/private-a02f0462dde22763de7c41ffa04debe7/basic.ics",
  },
  {
    name: "Pessoal",
    color: "#8E24AA",
    url: "https://calendar.google.com/calendar/ical/danielbaggio%40gmail.com/private-c0ce49e420ce88248880bb0fed53b312/basic.ics",
  },
  {
    name: "Rotina",
    color: "#AD1457",
    url: "https://calendar.google.com/calendar/ical/rg5kcagjemkup9r51t9fis1qqs%40group.calendar.google.com/private-7868129cfbea485e89c90afbf8a437fa/basic.ics",
  },
];

export const DEFAULT_SETTINGS: SmartNotesSettings = {
  agendaDaysAhead: 21,
  icsCalendars: DEFAULT_ICS_CALENDARS,
};
