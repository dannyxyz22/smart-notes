import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, "..");
const sourcePath = path.join(projectRoot, "src", "data", "saints.ts");
const source = await fs.readFile(sourcePath, "utf8");
const match = source.match(/Object\.freeze\(\s*([\s\S]*?)\s*\);/);

if (!match) throw new Error("Não foi possível localizar SAINTS_BY_DATE.");
const calendar = JSON.parse(match[1]);
const keys = Object.keys(calendar);

if (keys.length !== 366) {
  throw new Error(`Esperadas 366 entradas; encontradas ${keys.length}.`);
}

for (let month = 1; month <= 12; month += 1) {
  const daysInMonth = new Date(2024, month, 0).getDate();
  for (let day = 1; day <= daysInMonth; day += 1) {
    const key = `${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const record = calendar[key];
    if (!record?.name?.trim()) throw new Error(`${key}: nome ausente.`);
    if (!record?.sourceUrl?.startsWith("https://www.vaticannews.va/pt/santo-do-dia/")) {
      throw new Error(`${key}: URL de origem inválida.`);
    }
  }
}

if (!calendar["08-04"].name.includes("João Maria Vianney")) {
  throw new Error("08-04 não apresenta São João Maria Vianney como santo principal.");
}
if (calendar["08-04"].name.includes("Justino")) {
  throw new Error("08-04 inclui indevidamente um santo secundário.");
}

for (const key of [
  "01-01", "02-01", "02-29", "03-01", "04-01", "05-01", "06-01",
  "07-01", "08-01", "09-01", "10-01", "11-01", "12-01", "12-31",
]) {
  if (!calendar[key]) throw new Error(`${key}: amostra obrigatória ausente.`);
}

console.log("Calendário do Santo do Dia válido: 366 entradas.");
