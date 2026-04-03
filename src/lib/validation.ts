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
