import ExcelJS from "exceljs";

export type SheetRows = Array<Record<string, unknown>>;

export type ParsedWorkbook = {
  sheets: Record<string, SheetRows>;
  errors: string[];
  counts: Record<string, number>;
};

const REQUIRED_SHEETS = [
  "mst_Houses",
  "mst_Breeds",
  "mst_FeedTypes",
  "mst_Suppliers",
  "mst_Customers",
  "mst_Vaccines_Meds",
  "mst_Employees",
  "mst_Settings",
  "reg_Flocks",
] as const;

function unwrap(value: unknown): unknown {
  if (value == null) return null;
  if (typeof value === "object") {
    if (value instanceof Date) return value;
    if ("result" in value) return unwrap((value as { result: unknown }).result);
    if ("text" in value) return (value as { text: string }).text;
    if ("richText" in value) {
      return (value as { richText: Array<{ text: string }> }).richText.map((t) => t.text).join("");
    }
  }
  return value;
}

export function cellStr(row: Record<string, unknown>, key: string, fallback = ""): string {
  const v = unwrap(row[key]);
  if (v == null || v === "") return fallback;
  return String(v).trim();
}

export function cellNum(row: Record<string, unknown>, key: string, fallback = 0): number {
  const v = unwrap(row[key]);
  if (v == null || v === "") return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export function cellDate(row: Record<string, unknown>, key: string): string {
  const v = unwrap(row[key]);
  if (v instanceof Date && !Number.isNaN(v.getTime())) return v.toISOString().slice(0, 10);
  const s = String(v ?? "").trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  const parsed = Date.parse(s);
  if (!Number.isNaN(parsed)) return new Date(parsed).toISOString().slice(0, 10);
  return "";
}

export function cellTime(row: Record<string, unknown>, key: string): string {
  const v = unwrap(row[key]);
  if (v instanceof Date && !Number.isNaN(v.getTime())) {
    return v.toISOString().slice(11, 19);
  }
  const s = String(v ?? "").trim();
  if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(s)) {
    const parts = s.split(":");
    const hh = (parts[0] ?? "00").padStart(2, "0");
    const mm = (parts[1] ?? "00").padStart(2, "0");
    const ss = (parts[2] ?? "00").padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
  }
  const n = Number(v);
  if (n > 0 && n < 1) {
    const total = Math.round(n * 86400);
    const hh = String(Math.floor(total / 3600)).padStart(2, "0");
    const mm = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
    const ss = String(total % 60).padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
  }
  return "07:00:00";
}

export function cellYes(row: Record<string, unknown>, key: string): boolean {
  return ["yes", "true", "1"].includes(cellStr(row, key).toLowerCase());
}

function sheetRows(ws: ExcelJS.Worksheet): SheetRows {
  const rows: SheetRows = [];
  const header: string[] = [];
  ws.eachRow((row, i) => {
    const values = row.values as unknown[];
    if (i === 1) {
      for (let c = 1; c < values.length; c++) header[c - 1] = String(unwrap(values[c]) ?? "");
      return;
    }
    const obj: Record<string, unknown> = {};
    let empty = true;
    header.forEach((h, idx) => {
      if (!h) return;
      const v = unwrap(values[idx + 1]);
      obj[h] = v instanceof Date ? v.toISOString().slice(0, 10) : v;
      if (v != null && v !== "") empty = false;
    });
    if (!empty) rows.push(obj);
  });
  return rows;
}

export async function parseFarmNowWorkbook(buffer: Buffer): Promise<ParsedWorkbook> {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(buffer as unknown as ExcelJS.Buffer);
  const errors: string[] = [];
  const sheets: Record<string, SheetRows> = {};
  const get = (name: string, required: boolean) => {
    const ws = wb.getWorksheet(name);
    if (!ws) {
      if (required) errors.push(`Missing sheet ${name}`);
      return [];
    }
    return sheetRows(ws);
  };

  for (const name of REQUIRED_SHEETS) sheets[name] = get(name, true);
  for (const name of [
    "mst_Lists",
    "reg_DailyMortality",
    "reg_FeedConsumption",
    "reg_FeedPurchases",
    "reg_WeeklyWeights",
    "reg_Vaccination_Health",
    "reg_MedicineStock",
    "reg_Sales_Dispatch",
    "reg_Expenses",
    "reg_OtherIncome",
    "reg_EnvironmentReadings",
    "reg_DailyRoutine",
  ]) {
    sheets[name] = get(name, false);
  }

  const flocks = sheets.reg_Flocks ?? [];
  if (flocks.length === 0) errors.push("No flocks found in reg_Flocks.");
  flocks.forEach((f, i) => {
    if (!cellStr(f, "FlockID")) errors.push(`Flock row ${i + 2}: missing FlockID`);
    if (cellNum(f, "InitialBirdCount") < 1) errors.push(`Flock ${cellStr(f, "FlockID")}: invalid initial count`);
  });

  const houses = sheets.mst_Houses ?? [];
  if (houses.length === 0) errors.push("No houses found in mst_Houses.");

  const counts: Record<string, number> = {};
  for (const [name, rows] of Object.entries(sheets)) counts[name] = rows.length;

  return { sheets, errors, counts };
}
