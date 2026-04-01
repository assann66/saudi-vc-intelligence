import { NextRequest, NextResponse } from "next/server";
import { sectors } from "@/data/sectors";
import { companies } from "@/data/companies";

export async function POST(req: NextRequest) {
  const { type, id } = await req.json();

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 503 });
  }

  let prompt: string;

  if (type === "sector") {
    const sector = sectors.find((s) => s.id === id);
    if (!sector) return NextResponse.json({ error: "Sector not found" }, { status: 404 });
    const sectorCompanies = companies.filter((c) => c.sectorId === id);

    prompt = `You are an expert Saudi VC analyst. Provide a concise investment analysis for the ${sector.name} (${sector.arabicName}) sector in Saudi Arabia.

Sector Data:
- Attractiveness Score: ${sector.attractiveness}/100
- Risk Score: ${sector.riskScore}/100
- Market Gap: ${sector.marketGap}/100
- Funding Momentum: ${sector.fundingMomentum}/100
- Competition Intensity: ${sector.competitionIntensity}/100
- Saudi Vision 2030 Relevance: ${sector.saudiRelevance}/100
- Total Funding: $${(sector.totalFunding / 1_000_000_000).toFixed(1)}B
- Companies: ${sector.companyCount}
- Avg Deal Size: $${(sector.avgDealSize / 1_000_000).toFixed(1)}M
- YoY Growth: ${sector.yoyGrowth}%
- Description: ${sector.description}

Top Companies: ${sectorCompanies.map((c) => `${c.name} (${c.stage}, $${(c.totalFunding / 1_000_000).toFixed(0)}M raised, ${c.investability}/100 investability)`).join("; ")}

Respond in JSON with this exact structure:
{
  "summary": "2-3 sentence executive summary",
  "outlook": "1-2 sentence forward-looking outlook",
  "topPlay": "Name the single best investment opportunity and why in 1-2 sentences"
}`;
  } else if (type === "company") {
    const company = companies.find((c) => c.id === id);
    if (!company) return NextResponse.json({ error: "Company not found" }, { status: 404 });
    const sector = sectors.find((s) => s.id === company.sectorId)!;

    prompt = `You are an expert Saudi VC analyst. Provide a concise investment analysis for ${company.name} (${company.arabicName}).

Company Data:
- Sector: ${sector.name}
- Stage: ${company.stage}
- Founded: ${company.foundedYear}
- HQ: ${company.hqCity}
- Total Funding: $${(company.totalFunding / 1_000_000).toFixed(0)}M
- Last Round: $${(company.lastRoundSize / 1_000_000).toFixed(0)}M (${company.lastRoundDate})
- Investability: ${company.investability}/100
- Risk Score: ${company.riskScore}/100
- Growth Rate: ${company.growthRate}%
- Employees: ${company.employees}
- Description: ${company.description}
- Investors: ${company.investors.join(", ")}

Sector Context: ${sector.name} has ${sector.attractiveness}/100 attractiveness, ${sector.saudiRelevance}/100 Saudi relevance, $${(sector.totalFunding / 1_000_000_000).toFixed(1)}B total funding, ${sector.yoyGrowth}% YoY growth.

Respond in JSON with this exact structure:
{
  "summary": "2-3 sentence executive summary of investment case",
  "moat": "1-2 sentences on competitive moat and defensibility",
  "catalyst": "1 sentence on the key near-term catalyst"
}`;
  } else {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 400,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: `API error: ${response.status}` }, { status: 502 });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text ?? "";

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
    }

    return NextResponse.json({ analysis: JSON.parse(jsonMatch[0]) });
  } catch {
    return NextResponse.json({ error: "AI analysis unavailable" }, { status: 502 });
  }
}
