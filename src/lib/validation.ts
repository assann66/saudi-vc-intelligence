import { z } from "zod";

export const companiesQuerySchema = z.object({
  sectorId: z.string().optional(),
  stage: z.string().optional(),
  sortBy: z.enum(["investability", "totalFunding", "growthRate", "riskScore", "name"]).default("investability"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export const sectorsQuerySchema = z.object({
  sortBy: z.enum(["attractiveness", "riskScore", "totalFunding", "companyCount", "name"]).default("attractiveness"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export const idParamSchema = z.object({
  id: z.string().min(1),
});

// Admin CRUD schemas
const stages = ["Pre-Seed", "Seed", "Series A", "Series B", "Series C", "Growth"] as const;

export const companyCreateSchema = z.object({
  id: z.string().min(1, "معرف الشركة مطلوب"),
  name: z.string().min(1, "اسم الشركة مطلوب"),
  arabicName: z.string().min(1, "الاسم العربي مطلوب"),
  sectorId: z.string().min(1, "القطاع مطلوب"),
  stage: z.enum(stages, { message: "مرحلة التمويل غير صالحة" }),
  foundedYear: z.number().int().min(1900).max(2030),
  totalFunding: z.number().min(0),
  lastRoundSize: z.number().min(0),
  lastRoundDate: z.string().min(1, "تاريخ آخر جولة مطلوب"),
  investability: z.number().int().min(0).max(100),
  riskScore: z.number().int().min(0).max(100),
  growthRate: z.number().int(),
  employees: z.number().int().min(0),
  hqCity: z.string().min(1, "المدينة مطلوبة"),
  description: z.string().min(1, "الوصف مطلوب"),
  investors: z.array(z.string()),
});

export const companyUpdateSchema = companyCreateSchema.partial().omit({ id: true });

export const sectorCreateSchema = z.object({
  id: z.string().min(1, "معرف القطاع مطلوب"),
  name: z.string().min(1, "اسم القطاع مطلوب"),
  arabicName: z.string().min(1, "الاسم العربي مطلوب"),
  attractiveness: z.number().int().min(0).max(100),
  riskScore: z.number().int().min(0).max(100),
  marketGap: z.number().int().min(0).max(100),
  fundingMomentum: z.number().int().min(0).max(100),
  competitionIntensity: z.number().int().min(0).max(100),
  saudiRelevance: z.number().int().min(0).max(100),
  totalFunding: z.number().min(0),
  companyCount: z.number().int().min(0),
  avgDealSize: z.number().min(0),
  yoyGrowth: z.number().int(),
  description: z.string().min(1, "الوصف مطلوب"),
});

export const sectorUpdateSchema = sectorCreateSchema.partial().omit({ id: true });
