import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import Papa from "papaparse";
import * as XLSX from "xlsx";

export const dynamic = "force-dynamic";

type ImportRow = {
  id?: string;
  name?: string;
  arabicName?: string;
  sectorId?: string;
  stage?: string;
  foundedYear?: string | number;
  totalFunding?: string | number;
  lastRoundSize?: string | number;
  lastRoundDate?: string;
  investability?: string | number;
  riskScore?: string | number;
  growthRate?: string | number;
  employees?: string | number;
  hqCity?: string;
  description?: string;
  investors?: string;
};

const VALID_STAGES = ["Pre-Seed", "Seed", "Series A", "Series B", "Series C", "Growth"];

const REQUIRED_FIELDS = ["id", "name", "arabicName", "sectorId", "stage", "description"] as const;

function parseNumber(val: string | number | undefined, fallback: number): number {
  if (val === undefined || val === "") return fallback;
  const n = typeof val === "number" ? val : parseFloat(val);
  return isNaN(n) ? fallback : n;
}

function parseInt2(val: string | number | undefined, fallback: number): number {
  if (val === undefined || val === "") return fallback;
  const n = typeof val === "number" ? Math.round(val) : parseInt(val, 10);
  return isNaN(n) ? fallback : n;
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

type ValidatedRow = {
  row: number;
  data: {
    id: string;
    name: string;
    arabicName: string;
    sectorId: string;
    stage: string;
    foundedYear: number;
    totalFunding: number;
    lastRoundSize: number;
    lastRoundDate: string;
    investability: number;
    riskScore: number;
    growthRate: number;
    employees: number;
    hqCity: string;
    description: string;
    investors: string;
  };
  errors: string[];
  warnings: string[];
  isDuplicate: boolean;
};

async function validateRows(rows: ImportRow[], type: string): Promise<ValidatedRow[]> {
  if (type !== "companies") {
    return validateSectorRows(rows);
  }

  const existingCompanies = await prisma.company.findMany({ select: { id: true, name: true } });
  const existingIds = new Set(existingCompanies.map((c) => c.id));
  const existingNames = new Set(existingCompanies.map((c) => c.name.toLowerCase()));
  const existingSectors = await prisma.sector.findMany({ select: { id: true } });
  const sectorIds = new Set(existingSectors.map((s) => s.id));

  return rows.map((row, idx) => {
    const errors: string[] = [];
    const warnings: string[] = [];
    let isDuplicate = false;

    for (const field of REQUIRED_FIELDS) {
      if (!row[field] || String(row[field]).trim() === "") {
        errors.push(`الحقل "${field}" مطلوب`);
      }
    }

    if (row.id && existingIds.has(row.id)) {
      isDuplicate = true;
      warnings.push(`الشركة بالمعرف "${row.id}" موجودة بالفعل`);
    }
    if (row.name && existingNames.has(row.name.toLowerCase())) {
      isDuplicate = true;
      warnings.push(`شركة بنفس الاسم "${row.name}" موجودة بالفعل`);
    }

    if (row.sectorId && !sectorIds.has(row.sectorId)) {
      errors.push(`القطاع "${row.sectorId}" غير موجود`);
    }

    if (row.stage && !VALID_STAGES.includes(row.stage)) {
      errors.push(`المرحلة "${row.stage}" غير صالحة. القيم المقبولة: ${VALID_STAGES.join(", ")}`);
    }

    const investability = clamp(parseInt2(row.investability, 50), 0, 100);
    const riskScore = clamp(parseInt2(row.riskScore, 50), 0, 100);
    const foundedYear = parseInt2(row.foundedYear, 2024);
    if (foundedYear < 1900 || foundedYear > 2030) {
      errors.push(`سنة التأسيس ${foundedYear} خارج النطاق المسموح (1900-2030)`);
    }

    const investorsStr = row.investors || "[]";
    let investors: string[];
    try {
      investors = JSON.parse(investorsStr);
      if (!Array.isArray(investors)) investors = [investorsStr];
    } catch {
      investors = investorsStr.split(",").map((s) => s.trim()).filter(Boolean);
    }

    return {
      row: idx + 1,
      data: {
        id: String(row.id || "").trim(),
        name: String(row.name || "").trim(),
        arabicName: String(row.arabicName || "").trim(),
        sectorId: String(row.sectorId || "").trim(),
        stage: String(row.stage || "Seed").trim(),
        foundedYear,
        totalFunding: parseNumber(row.totalFunding, 0),
        lastRoundSize: parseNumber(row.lastRoundSize, 0),
        lastRoundDate: String(row.lastRoundDate || "").trim(),
        investability,
        riskScore,
        growthRate: parseInt2(row.growthRate, 0),
        employees: Math.max(0, parseInt2(row.employees, 0)),
        hqCity: String(row.hqCity || "").trim(),
        description: String(row.description || "").trim(),
        investors: JSON.stringify(investors),
      },
      errors,
      warnings,
      isDuplicate,
    };
  });
}

type SectorRow = {
  id?: string;
  name?: string;
  arabicName?: string;
  attractiveness?: string | number;
  riskScore?: string | number;
  marketGap?: string | number;
  fundingMomentum?: string | number;
  competitionIntensity?: string | number;
  saudiRelevance?: string | number;
  totalFunding?: string | number;
  companyCount?: string | number;
  avgDealSize?: string | number;
  yoyGrowth?: string | number;
  description?: string;
};

const SECTOR_REQUIRED = ["id", "name", "arabicName", "description"] as const;

async function validateSectorRows(rows: ImportRow[]): Promise<ValidatedRow[]> {
  const existing = await prisma.sector.findMany({ select: { id: true, name: true } });
  const existingIds = new Set(existing.map((s) => s.id));
  const existingNames = new Set(existing.map((s) => s.name.toLowerCase()));

  return (rows as unknown as SectorRow[]).map((row, idx) => {
    const errors: string[] = [];
    const warnings: string[] = [];
    let isDuplicate = false;

    for (const field of SECTOR_REQUIRED) {
      if (!row[field] || String(row[field]).trim() === "") {
        errors.push(`الحقل "${field}" مطلوب`);
      }
    }

    if (row.id && existingIds.has(row.id)) {
      isDuplicate = true;
      warnings.push(`القطاع بالمعرف "${row.id}" موجود بالفعل`);
    }
    if (row.name && existingNames.has(row.name.toLowerCase())) {
      isDuplicate = true;
      warnings.push(`قطاع بنفس الاسم "${row.name}" موجود بالفعل`);
    }

    return {
      row: idx + 1,
      data: {
        id: String(row.id || "").trim(),
        name: String(row.name || "").trim(),
        arabicName: String(row.arabicName || "").trim(),
        sectorId: "",
        stage: "",
        foundedYear: 0,
        totalFunding: parseNumber(row.totalFunding, 0),
        lastRoundSize: 0,
        lastRoundDate: "",
        investability: 0,
        riskScore: clamp(parseInt2(row.riskScore, 50), 0, 100),
        growthRate: parseInt2(row.yoyGrowth, 0),
        employees: 0,
        hqCity: "",
        description: String(row.description || "").trim(),
        investors: JSON.stringify({
          attractiveness: clamp(parseInt2(row.attractiveness, 50), 0, 100),
          marketGap: clamp(parseInt2(row.marketGap, 50), 0, 100),
          fundingMomentum: clamp(parseInt2(row.fundingMomentum, 50), 0, 100),
          competitionIntensity: clamp(parseInt2(row.competitionIntensity, 50), 0, 100),
          saudiRelevance: clamp(parseInt2(row.saudiRelevance, 50), 0, 100),
          companyCount: parseInt2(row.companyCount, 0),
          avgDealSize: parseNumber(row.avgDealSize, 0),
        }),
      },
      errors,
      warnings,
      isDuplicate,
    };
  });
}

function parseFile(buffer: Buffer, filename: string): ImportRow[] {
  const ext = filename.toLowerCase().split(".").pop();

  if (ext === "csv") {
    const text = buffer.toString("utf-8");
    const result = Papa.parse<ImportRow>(text, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h: string) => h.trim(),
    });
    if (result.errors.length > 0) {
      const errMsgs = result.errors.map((e) => `سطر ${e.row}: ${e.message}`).join("; ");
      throw new Error(`أخطاء في تحليل CSV: ${errMsgs}`);
    }
    return result.data;
  }

  if (ext === "xlsx" || ext === "xls") {
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) throw new Error("الملف لا يحتوي على أي ورقة بيانات");
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json<ImportRow>(sheet, { defval: "" });
    return rows;
  }

  throw new Error("نوع الملف غير مدعوم. يرجى استخدام CSV أو XLSX");
}

// POST: Parse file and return preview with validation
export async function POST(request: Request) {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const type = (formData.get("type") as string) || "companies";
    const action = (formData.get("action") as string) || "preview";

    if (!file) {
      return NextResponse.json({ error: "لم يتم تحديد ملف" }, { status: 400 });
    }

    if (!["companies", "sectors"].includes(type)) {
      return NextResponse.json({ error: "نوع الاستيراد غير صالح" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let rows: ImportRow[];
    try {
      rows = parseFile(buffer, file.name);
    } catch (err) {
      return NextResponse.json(
        { error: err instanceof Error ? err.message : "خطأ في تحليل الملف" },
        { status: 400 }
      );
    }

    if (rows.length === 0) {
      return NextResponse.json({ error: "الملف لا يحتوي على بيانات" }, { status: 400 });
    }

    const validated = await validateRows(rows, type);
    const totalErrors = validated.filter((r) => r.errors.length > 0).length;
    const totalDuplicates = validated.filter((r) => r.isDuplicate).length;

    if (action === "preview") {
      return NextResponse.json({
        type,
        totalRows: rows.length,
        totalErrors,
        totalDuplicates,
        columns: Object.keys(rows[0] || {}),
        rows: validated,
      });
    }

    // action === "import" — insert valid, non-duplicate rows
    const skipDuplicates = formData.get("skipDuplicates") !== "false";
    const toInsert = validated.filter((r) => {
      if (r.errors.length > 0) return false;
      if (skipDuplicates && r.isDuplicate) return false;
      return true;
    });

    if (toInsert.length === 0) {
      return NextResponse.json(
        { error: "لا توجد صفوف صالحة للاستيراد", totalErrors, totalDuplicates },
        { status: 400 }
      );
    }

    let imported = 0;
    if (type === "companies") {
      await prisma.$transaction(async (tx) => {
        for (const row of toInsert) {
          await tx.company.create({ data: row.data });
          imported++;
        }
      });
    } else {
      await prisma.$transaction(async (tx) => {
        for (const row of toInsert) {
          const sectorData = JSON.parse(row.data.investors);
          await tx.sector.create({
            data: {
              id: row.data.id,
              name: row.data.name,
              arabicName: row.data.arabicName,
              attractiveness: sectorData.attractiveness,
              riskScore: row.data.riskScore,
              marketGap: sectorData.marketGap,
              fundingMomentum: sectorData.fundingMomentum,
              competitionIntensity: sectorData.competitionIntensity,
              saudiRelevance: sectorData.saudiRelevance,
              totalFunding: row.data.totalFunding,
              companyCount: sectorData.companyCount,
              avgDealSize: sectorData.avgDealSize,
              yoyGrowth: row.data.growthRate,
              description: row.data.description,
            },
          });
          imported++;
        }
      });
    }

    return NextResponse.json({
      success: true,
      imported,
      skipped: validated.length - toInsert.length,
      totalErrors,
      totalDuplicates,
    });
  } catch (error) {
    console.error("خطأ في استيراد البيانات:", error);
    return NextResponse.json(
      { error: "حدث خطأ في الخادم أثناء استيراد البيانات" },
      { status: 500 }
    );
  }
}
