import { requestUrl } from "obsidian";

interface GoogleCalendarCreateEventPayload {
  key: string;
  action: "create_event";
  title: string;
  startTime: string;
  endTime: string;
  calendarId?: string;
  description?: string;
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
 */
export async function createGoogleCalendarEvent(
  webhookUrl: string,
  apiKey: string,
  calendarId: string,
  title: string,
  startTime: string,
  endTime: string,
  description?: string
): Promise<GoogleCalendarResponse> {
  const payload: GoogleCalendarCreateEventPayload = {
    key: apiKey,
    action: "create_event",
    title,
    startTime,
    endTime,
    calendarId,
    description,
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
