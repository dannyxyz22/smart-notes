import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const VATICAN_BASE_URL = "https://www.vaticannews.va";
const SOURCE_INDEX_URL = `${VATICAN_BASE_URL}/pt/santo-do-dia.html`;
const CONCURRENCY = 8;

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, "..");
const outputPath = path.join(projectRoot, "src", "data", "saints.ts");

function pad(value) {
  return String(value).padStart(2, "0");
}

function decodeHtml(value) {
  const namedEntities = {
    amp: "&",
    apos: "'",
    gt: ">",
    lt: "<",
    nbsp: " ",
    quot: '"',
  };

  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&(#(?:x[0-9a-f]+|\d+)|[a-z]+);/gi, (match, entity) => {
      if (entity.startsWith("#x") || entity.startsWith("#X")) {
        return String.fromCodePoint(Number.parseInt(entity.slice(2), 16));
      }
      if (entity.startsWith("#")) {
        return String.fromCodePoint(Number.parseInt(entity.slice(1), 10));
      }
      return namedEntities[entity.toLowerCase()] ?? match;
    })
    .replace(/\s+/g, " ")
    .trim();
}

function extractPrimarySaint(html, dateKey, dailyUrl) {
  const sectionMatch = html.match(
    /<section\s+class="[^"]*section--isStatic[^"]*"[\s\S]*?<\/section>/i
  );
  if (!sectionMatch) {
    throw new Error(`${dateKey}: nenhuma seção de santo encontrada`);
  }

  const section = sectionMatch[0];
  const headingMatch = section.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
  if (!headingMatch) {
    throw new Error(`${dateKey}: nome do santo não encontrado`);
  }

  const detailMatch = section.match(
    /<a\s+[^>]*class="[^"]*saintReadMore[^"]*"[^>]*href="([^"]+)"/i
  );
  const detailUrl = detailMatch
    ? new URL(decodeHtml(detailMatch[1]), VATICAN_BASE_URL).href
    : dailyUrl;

  return {
    name: decodeHtml(headingMatch[1]),
    sourceUrl: detailUrl,
  };
}

function calendarDates() {
  const dates = [];
  for (let month = 1; month <= 12; month += 1) {
    const daysInMonth = new Date(2024, month, 0).getDate();
    for (let day = 1; day <= daysInMonth; day += 1) {
      dates.push({ day, month, dateKey: `${pad(month)}-${pad(day)}` });
    }
  }
  return dates;
}

async function fetchSaint({ day, month, dateKey }) {
  const dailyUrl = `${VATICAN_BASE_URL}/pt/santo-do-dia/${pad(month)}/${pad(day)}.html`;
  const response = await fetch(dailyUrl, {
    headers: { "User-Agent": "smart-notes-saints-maintenance/1.0" },
  });
  if (!response.ok) {
    throw new Error(`${dateKey}: Vatican News respondeu HTTP ${response.status}`);
  }

  return [dateKey, extractPrimarySaint(await response.text(), dateKey, dailyUrl)];
}

async function mapWithConcurrency(items, worker, concurrency) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function consume() {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await worker(items[index]);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => consume())
  );
  return results;
}

function renderSource(entries) {
  const reviewedOn = new Date().toISOString().slice(0, 10);
  const records = Object.fromEntries(entries);
  const serializedRecords = JSON.stringify(records, null, 2);

  return `/**
 * Calendário offline do Santo do Dia.
 * Fonte editorial: Vatican News (${SOURCE_INDEX_URL})
 * Última revisão: ${reviewedOn}
 *
 * Atualize com \`npm run saints:update\` e valide com
 * \`npm run saints:validate\` antes de publicar uma nova versão.
 */

export interface SaintOfDayRecord {
  readonly name: string;
  readonly sourceUrl: string;
}

export const SAINTS_BY_DATE: Readonly<Record<string, SaintOfDayRecord>> = Object.freeze(
${serializedRecords}
);

export function localDateKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return \`${"${month}-${day}"}\`;
}

export function getSaintOfDay(date: Date): SaintOfDayRecord | null {
  return SAINTS_BY_DATE[localDateKey(date)] ?? null;
}
`;
}

const entries = await mapWithConcurrency(
  calendarDates(),
  async (date) => {
    const entry = await fetchSaint(date);
    process.stdout.write(".");
    return entry;
  },
  CONCURRENCY
);

if (entries.length !== 366) {
  throw new Error(`Esperadas 366 entradas; recebidas ${entries.length}`);
}

await fs.writeFile(outputPath, renderSource(entries), "utf8");
process.stdout.write(`\nCalendário salvo em ${path.relative(projectRoot, outputPath)}.\n`);
