import { requestUrl } from "obsidian";

interface GoogleCalendarCreateEventPayload {
  key: string;
  action: "create_event";
  title: string;
  startTime: string;
  endTime: string;
  calendarId?: string;
  description?: string;
  /**
   * Minutos antes do evento para disparar um popup reminder.
   * Requer que o Google Apps Script (index.gs) esteja na versão com suporte
   * a reminderMinutes — veja src/reminder/index.gs.
   */
  reminderMinutes?: number;
}

interface GoogleCalendarResponse {
  status: "ok" | "error";
  data?: Record<string, unknown>;
  error?: string;
  timestamp: string;
}

/**
 * Envia uma requisição POST para o Google Apps Script Web App
 * para criar um evento no Google Calendar.
 *
 * @param reminderMinutes - Minutos antes do evento para o popup reminder (padrão: 5).
 */
export async function createGoogleCalendarEvent(
  webhookUrl: string,
  apiKey: string,
  calendarId: string,
  title: string,
  startTime: string,
  endTime: string,
  description?: string,
  reminderMinutes = 5
): Promise<GoogleCalendarResponse> {
  const payload: GoogleCalendarCreateEventPayload = {
    key: apiKey,
    action: "create_event",
    title,
    startTime,
    endTime,
    calendarId,
    description,
    reminderMinutes,
  };

  const response = await requestUrl({
    url: webhookUrl,
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return JSON.parse(response.text) as GoogleCalendarResponse;
}
