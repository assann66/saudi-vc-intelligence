import { Sector } from "@/data/sectors";
import { Company } from "@/data/companies";

export interface ScoreExplanation {
  score: number;
  label: string;
  rating: "Excellent" | "Strong" | "Moderate" | "Weak" | "Poor";
  factors: string[];
}

export interface SectorAnalysis {
  sectorAttractiveness: ScoreExplanation;
  riskScore: ScoreExplanation;
  marketGap: ScoreExplanation;
  fundingMomentum: ScoreExplanation;
  competitionIntensity: ScoreExplanation;
  saudiRelevance: ScoreExplanation;
  overallVerdict: string;
  investmentThesis: string;
  keyOpportunities: string[];
  keyRisks: string[];
}

export interface CompanyAnalysis {
  investability: ScoreExplanation;
  riskScore: ScoreExplanation;
  marketGap: ScoreExplanation;
  fundingMomentum: ScoreExplanation;
  competitionIntensity: ScoreExplanation;
  saudiRelevance: ScoreExplanation;
  overallVerdict: string;
  investmentThesis: string;
  strengths: string[];
  risks: string[];
  recommendation: "Strong Buy" | "Buy" | "Hold" | "Watch" | "Avoid";
}

function getRating(score: number): ScoreExplanation["rating"] {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Strong";
  if (score >= 50) return "Moderate";
  if (score >= 30) return "Weak";
  return "Poor";
}

export function analyzeSector(sector: Sector, sectorCompanies: Company[]): SectorAnalysis {
  const avgInvestability = sectorCompanies.length > 0
    ? sectorCompanies.reduce((sum, c) => sum + c.investability, 0) / sectorCompanies.length
    : 0;
  const avgRisk = sectorCompanies.length > 0
    ? sectorCompanies.reduce((sum, c) => sum + c.riskScore, 0) / sectorCompanies.length
    : 0;
  const attractivenessFactors: string[] = [];
  if (sector.attractiveness >= 85) attractivenessFactors.push("Top-tier sector attractiveness driven by strong fundamentals and growth trajectory");
  else if (sector.attractiveness >= 70) attractivenessFactors.push("Above-average sector attractiveness with solid market dynamics");
  else attractivenessFactors.push("Moderate attractiveness — sector is developing but not yet mature");

  if (sector.yoyGrowth >= 40) attractivenessFactors.push(`Exceptional YoY growth of ${sector.yoyGrowth}% signals accelerating investor interest`);
  else if (sector.yoyGrowth >= 25) attractivenessFactors.push(`Healthy YoY growth of ${sector.yoyGrowth}% indicates sustained momentum`);

  if (sectorCompanies.length >= 4) attractivenessFactors.push(`${sectorCompanies.length} tracked companies demonstrate a maturing ecosystem`);
  if (avgInvestability >= 80) attractivenessFactors.push(`High average investability (${avgInvestability.toFixed(0)}) across portfolio companies`);

  const riskFactors: string[] = [];
  if (sector.riskScore <= 35) riskFactors.push("Low overall risk profile with established business models and proven revenue");
  else if (sector.riskScore <= 50) riskFactors.push("Moderate risk level typical for growth-stage sectors");
  else riskFactors.push("Elevated risk reflecting regulatory uncertainty or market immaturity");

  if (sector.competitionIntensity >= 70) riskFactors.push("High competition intensity may compress margins and increase customer acquisition costs");
  if (avgRisk >= 40) riskFactors.push(`Average company risk score of ${avgRisk.toFixed(0)} warrants careful due diligence`);
  if (sector.riskScore <= 40 && sector.fundingMomentum >= 75) riskFactors.push("Strong funding momentum with manageable risk creates favorable conditions");

  const marketGapFactors: string[] = [];
  if (sector.marketGap >= 80) marketGapFactors.push("Significant untapped market opportunity — large addressable market with low penetration");
  else if (sector.marketGap >= 60) marketGapFactors.push("Notable market gaps remain, offering room for new entrants and innovation");
  else marketGapFactors.push("Market is relatively well-served; differentiation required for new entrants");

  if (sector.saudiRelevance >= 90 && sector.marketGap >= 70) marketGapFactors.push("Strong Vision 2030 alignment creates policy-driven demand tailwinds");
  if (sector.companyCount < 30) marketGapFactors.push(`Only ${sector.companyCount} companies in the sector suggests opportunity for expansion`);

  const fundingFactors: string[] = [];
  if (sector.fundingMomentum >= 80) fundingFactors.push("Exceptional funding velocity — investors are actively deploying capital");
  else if (sector.fundingMomentum >= 60) fundingFactors.push("Solid funding momentum with consistent deal flow");
  else fundingFactors.push("Funding activity is building but not yet at peak velocity");

  if (sector.avgDealSize >= 15_000_000) fundingFactors.push(`Large average deal size ($${(sector.avgDealSize / 1_000_000).toFixed(1)}M) indicates institutional investor confidence`);
  if (sector.totalFunding >= 1_000_000_000) fundingFactors.push(`$${(sector.totalFunding / 1_000_000_000).toFixed(1)}B total sector funding demonstrates deep capital commitment`);

  const competitionFactors: string[] = [];
  if (sector.competitionIntensity >= 70) competitionFactors.push("Highly competitive landscape with multiple well-funded players");
  else if (sector.competitionIntensity >= 45) competitionFactors.push("Moderate competition — room exists for differentiated solutions");
  else competitionFactors.push("Low competition intensity creates a blue-ocean opportunity for first movers");

  if (sectorCompanies.some(c => c.stage === "Growth")) competitionFactors.push("Presence of growth-stage companies indicates market consolidation is underway");
  if (sectorCompanies.filter(c => c.stage === "Series A" || c.stage === "Seed").length >= 2) competitionFactors.push("Active early-stage pipeline suggests continued innovation and new market entrants");

  const relevanceFactors: string[] = [];
  if (sector.saudiRelevance >= 90) relevanceFactors.push("Directly aligned with Saudi Vision 2030 national transformation priorities");
  else if (sector.saudiRelevance >= 75) relevanceFactors.push("Strong relevance to Saudi economic diversification goals");
  else relevanceFactors.push("Tangential alignment with Vision 2030 — may benefit from broader digitization trends");

  if (sector.saudiRelevance >= 90 && sector.yoyGrowth >= 30) relevanceFactors.push("Government policy support combined with market growth creates powerful secular trend");
  if (sector.id === "cleantech" || sector.id === "proptech") relevanceFactors.push("Mega-project demand (NEOM, The Line, Red Sea) provides guaranteed demand pipeline");
  if (sector.id === "fintech") relevanceFactors.push("SAMA regulatory sandbox and open banking mandates accelerating innovation");
  if (sector.id === "entertainment") relevanceFactors.push("General Entertainment Authority driving unprecedented sector opening");

  const overallScore = (sector.attractiveness * 0.25 + (100 - sector.riskScore) * 0.2 + sector.marketGap * 0.15 + sector.fundingMomentum * 0.15 + (100 - sector.competitionIntensity) * 0.1 + sector.saudiRelevance * 0.15);

  let overallVerdict: string;
  if (overallScore >= 80) overallVerdict = `${sector.name} is a top-tier investment sector in the Saudi VC ecosystem. With an attractiveness score of ${sector.attractiveness}/100 and ${sector.yoyGrowth}% YoY growth, this sector offers compelling risk-adjusted returns for investors aligned with Vision 2030.`;
  else if (overallScore >= 65) overallVerdict = `${sector.name} presents a strong investment opportunity with balanced risk-reward dynamics. The sector's ${sector.saudiRelevance}/100 Saudi relevance score and ${sector.fundingMomentum}/100 funding momentum indicate sustained institutional interest.`;
  else overallVerdict = `${sector.name} is an emerging sector with growth potential but higher uncertainty. Selective investments in market leaders may offer attractive returns as the sector matures.`;

  let investmentThesis: string;
  if (sector.attractiveness >= 85 && sector.saudiRelevance >= 85) {
    investmentThesis = `Invest in ${sector.name} leaders benefiting from structural tailwinds: Vision 2030 policy support, rapid market growth (${sector.yoyGrowth}% YoY), and significant market gaps (${sector.marketGap}/100). Focus on Series B+ companies with proven unit economics.`;
  } else if (sector.marketGap >= 75 && sector.competitionIntensity <= 45) {
    investmentThesis = `Early-mover advantage opportunity in ${sector.name}. Low competition (${sector.competitionIntensity}/100) combined with large market gaps (${sector.marketGap}/100) favors backing innovative startups at Series A/B stages.`;
  } else {
    investmentThesis = `Selective deployment in ${sector.name} targeting category leaders with defensible moats. Prioritize companies demonstrating strong revenue growth and clear paths to profitability.`;
  }

  const keyOpportunities: string[] = [];
  if (sector.marketGap >= 70) keyOpportunities.push("Large underserved market with low digital penetration");
  if (sector.yoyGrowth >= 40) keyOpportunities.push("Accelerating growth trajectory attracting top-tier investors");
  if (sector.saudiRelevance >= 90) keyOpportunities.push("Direct Vision 2030 alignment creates regulatory tailwinds");
  if (sector.fundingMomentum >= 80) keyOpportunities.push("Strong capital availability enables rapid scaling");
  if (sector.competitionIntensity <= 40) keyOpportunities.push("Low competition allows for market-defining positioning");
  if (keyOpportunities.length === 0) keyOpportunities.push("Steady market growth supports long-term investment thesis");

  const keyRisks: string[] = [];
  if (sector.riskScore >= 50) keyRisks.push("Above-average sector risk requires enhanced due diligence");
  if (sector.competitionIntensity >= 70) keyRisks.push("Intense competition may lead to margin compression and consolidation");
  if (sector.fundingMomentum >= 85 && sector.riskScore >= 40) keyRisks.push("High funding velocity in a risky sector may indicate overheating");
  if (sector.marketGap >= 80 && sectorCompanies.length < 3) keyRisks.push("Large market gap with few players suggests execution complexity");
  if (keyRisks.length === 0) keyRisks.push("Sector fundamentals are healthy with no major systemic risks identified");

  return {
    sectorAttractiveness: { score: sector.attractiveness, label: "Sector Attractiveness", rating: getRating(sector.attractiveness), factors: attractivenessFactors },
    riskScore: { score: sector.riskScore, label: "Risk Score", rating: getRating(100 - sector.riskScore), factors: riskFactors },
    marketGap: { score: sector.marketGap, label: "Market Gap Opportunity", rating: getRating(sector.marketGap), factors: marketGapFactors },
    fundingMomentum: { score: sector.fundingMomentum, label: "Funding Momentum", rating: getRating(sector.fundingMomentum), factors: fundingFactors },
    competitionIntensity: { score: sector.competitionIntensity, label: "Competition Intensity", rating: getRating(100 - sector.competitionIntensity), factors: competitionFactors },
    saudiRelevance: { score: sector.saudiRelevance, label: "Saudi Market Relevance", rating: getRating(sector.saudiRelevance), factors: relevanceFactors },
    overallVerdict,
    investmentThesis,
    keyOpportunities,
    keyRisks,
  };
}

export function analyzeCompany(company: Company, sector: Sector, sectorCompanies: Company[]): CompanyAnalysis {
  const sectorAvgInvestability = sectorCompanies.reduce((s, c) => s + c.investability, 0) / sectorCompanies.length;
  const sectorAvgRisk = sectorCompanies.reduce((s, c) => s + c.riskScore, 0) / sectorCompanies.length;
  const sectorAvgFunding = sectorCompanies.reduce((s, c) => s + c.totalFunding, 0) / sectorCompanies.length;
  const sectorAvgGrowth = sectorCompanies.reduce((s, c) => s + c.growthRate, 0) / sectorCompanies.length;

  const investabilityFactors: string[] = [];
  if (company.investability >= 85) investabilityFactors.push("Top-tier investability score driven by strong fundamentals, market position, and growth trajectory");
  else if (company.investability >= 70) investabilityFactors.push("Above-average investability with solid business model and growth potential");
  else investabilityFactors.push("Moderate investability — company shows promise but needs to demonstrate further traction");

  if (company.investability > sectorAvgInvestability) investabilityFactors.push(`Outperforms sector average (${sectorAvgInvestability.toFixed(0)}) by ${(company.investability - sectorAvgInvestability).toFixed(0)} points`);
  if (company.totalFunding >= sectorAvgFunding * 1.5) investabilityFactors.push("Significantly higher funding than sector peers indicates strong investor conviction");
  if (company.growthRate >= 50) investabilityFactors.push(`Exceptional ${company.growthRate}% growth rate demonstrates strong product-market fit`);
  if (company.investors.length >= 3) investabilityFactors.push(`Backed by ${company.investors.length} institutional investors including ${company.investors[0]}`);

  const riskFactors: string[] = [];
  if (company.riskScore <= 30) riskFactors.push("Low risk profile — mature business model with established revenue streams");
  else if (company.riskScore <= 45) riskFactors.push("Moderate risk level appropriate for current growth stage");
  else riskFactors.push("Elevated risk — early-stage dynamics or market uncertainty");

  if (company.riskScore < sectorAvgRisk) riskFactors.push(`Below sector average risk (${sectorAvgRisk.toFixed(0)}), indicating stronger positioning`);
  else if (company.riskScore > sectorAvgRisk + 5) riskFactors.push(`Above sector average risk — may face additional challenges vs. peers`);

  if (company.stage === "Growth" || company.stage === "Series C") riskFactors.push("Late-stage maturity provides revenue visibility and reduced execution risk");
  else if (company.stage === "Seed" || company.stage === "Pre-Seed") riskFactors.push("Early-stage venture with higher inherent uncertainty but greater upside potential");

  const fundingMomentumScore = Math.min(100, Math.round(
    (company.totalFunding / sector.avgDealSize) * 15 +
    (company.growthRate / 100) * 40 +
    (company.stage === "Growth" ? 30 : company.stage === "Series C" ? 25 : company.stage === "Series B" ? 20 : 10)
  ));

  const fundingFactors: string[] = [];
  if (company.totalFunding >= 100_000_000) fundingFactors.push(`$${(company.totalFunding / 1_000_000).toFixed(0)}M total funding demonstrates deep institutional backing`);
  if (company.lastRoundSize >= 50_000_000) fundingFactors.push(`Last round of $${(company.lastRoundSize / 1_000_000).toFixed(0)}M shows increasing investor confidence`);
  fundingFactors.push(`${company.stage} stage with last funding in ${company.lastRoundDate}`);
  if (company.totalFunding > sectorAvgFunding) fundingFactors.push("Above-average funding for sector positions company as a capital leader");

  const competitionScore = sector.competitionIntensity;
  const competitionFactors: string[] = [];
  if (company.investability >= 85 && competitionScore >= 60) competitionFactors.push("Market leader with strong competitive moat despite intense competition");
  else if (competitionScore >= 60) competitionFactors.push("Operating in a competitive market — differentiation is critical");
  else competitionFactors.push("Favorable competitive landscape with room to capture market share");

  if (company.employees >= 300) competitionFactors.push(`${company.employees} employees signals operational scale and market presence`);
  if (company.growthRate > sectorAvgGrowth) competitionFactors.push("Growing faster than sector average indicates competitive advantage");

  const relevanceScore = sector.saudiRelevance;
  const relevanceFactors: string[] = [];
  if (relevanceScore >= 90) relevanceFactors.push("Directly contributes to Saudi Vision 2030 transformation goals");
  else if (relevanceScore >= 75) relevanceFactors.push("Well-aligned with Saudi economic diversification priorities");

  if (company.hqCity === "Riyadh") relevanceFactors.push("Headquartered in Riyadh — central to Saudi tech ecosystem");
  else relevanceFactors.push(`Based in ${company.hqCity} — positioned for regional specialization`);

  relevanceFactors.push(`Operating in ${sector.name}, a priority sector with ${sector.saudiRelevance}/100 Vision 2030 alignment`);

  const marketGapScore = sector.marketGap;
  const marketGapFactors: string[] = [];
  if (marketGapScore >= 75) marketGapFactors.push("Large addressable market gap provides significant growth runway");
  else marketGapFactors.push("Market is maturing but pockets of opportunity remain for differentiated players");

  if (company.growthRate >= 50 && marketGapScore >= 70) marketGapFactors.push("Rapid growth in an underserved market suggests company is capturing unmet demand");

  const overallScore = company.investability * 0.3 + (100 - company.riskScore) * 0.25 + fundingMomentumScore * 0.15 + company.growthRate * 0.15 + relevanceScore * 0.15;

  let recommendation: CompanyAnalysis["recommendation"];
  if (overallScore >= 80) recommendation = "Strong Buy";
  else if (overallScore >= 68) recommendation = "Buy";
  else if (overallScore >= 55) recommendation = "Hold";
  else if (overallScore >= 40) recommendation = "Watch";
  else recommendation = "Avoid";

  let overallVerdict: string;
  if (recommendation === "Strong Buy" || recommendation === "Buy") {
    overallVerdict = `${company.name} is a standout investment opportunity in the ${sector.name} sector. With a ${company.investability}/100 investability score, ${company.growthRate}% growth rate, and backing from ${company.investors.slice(0, 2).join(" and ")}, the company demonstrates strong fundamentals and market positioning.`;
  } else if (recommendation === "Hold") {
    overallVerdict = `${company.name} shows promise but carries some uncertainty. The ${company.investability}/100 investability and ${company.riskScore}/100 risk profile suggest monitoring for further traction before increasing allocation.`;
  } else {
    overallVerdict = `${company.name} is in an early development phase. While the ${sector.name} sector offers long-term potential, the company needs to demonstrate stronger unit economics and market traction.`;
  }

  const investmentThesis = `${company.name} (${company.stage}) represents a ${recommendation === "Strong Buy" || recommendation === "Buy" ? "compelling" : "developing"} opportunity in Saudi ${sector.name}. Founded in ${company.foundedYear} and headquartered in ${company.hqCity}, the company has raised $${(company.totalFunding / 1_000_000).toFixed(0)}M to date. ${company.description} Key thesis drivers: ${company.growthRate}% growth, ${company.investability}/100 investability, and ${sector.saudiRelevance}/100 sector relevance to Vision 2030.`;

  const strengths: string[] = [];
  if (company.investability >= 80) strengths.push("High investability score signals strong market fit and execution");
  if (company.growthRate >= 50) strengths.push(`Exceptional ${company.growthRate}% growth rate outpacing market`);
  if (company.riskScore <= 35) strengths.push("Low risk profile with proven revenue model");
  if (company.totalFunding >= 100_000_000) strengths.push("Significant capital base enables aggressive market expansion");
  if (company.investors.length >= 3) strengths.push(`Strong investor syndicate: ${company.investors.join(", ")}`);
  if (company.employees >= 200) strengths.push(`Scale operations with ${company.employees}+ employees`);
  if (strengths.length === 0) strengths.push("Early-stage potential with room for significant upside");

  const risks: string[] = [];
  if (company.riskScore >= 45) risks.push("Above-average risk profile requires careful monitoring");
  if (company.stage === "Seed" || company.stage === "Pre-Seed") risks.push("Early stage — product-market fit may not be fully validated");
  if (sector.competitionIntensity >= 70) risks.push("Intense sector competition may compress margins");
  if (company.growthRate < 30) risks.push("Below-average growth rate may indicate market saturation or execution challenges");
  if (company.totalFunding < sectorAvgFunding * 0.5) risks.push("Lower funding relative to peers may limit competitive positioning");
  if (risks.length === 0) risks.push("No major risk flags identified — maintain standard monitoring");

  return {
    investability: { score: company.investability, label: "Investability Score", rating: getRating(company.investability), factors: investabilityFactors },
    riskScore: { score: company.riskScore, label: "Risk Score", rating: getRating(100 - company.riskScore), factors: riskFactors },
    marketGap: { score: marketGapScore, label: "Market Gap Opportunity", rating: getRating(marketGapScore), factors: marketGapFactors },
    fundingMomentum: { score: fundingMomentumScore, label: "Funding Momentum", rating: getRating(fundingMomentumScore), factors: fundingFactors },
    competitionIntensity: { score: competitionScore, label: "Competition Intensity", rating: getRating(100 - competitionScore), factors: competitionFactors },
    saudiRelevance: { score: relevanceScore, label: "Saudi Market Relevance", rating: getRating(relevanceScore), factors: relevanceFactors },
    overallVerdict,
    investmentThesis,
    strengths,
    risks,
    recommendation,
  };
}
