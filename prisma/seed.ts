import { PrismaClient } from "@prisma/client";
import { sectors } from "../src/data/sectors";
import { companies } from "../src/data/companies";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  for (const sector of sectors) {
    await prisma.sector.upsert({
      where: { id: sector.id },
      update: { ...sector },
      create: { ...sector },
    });
  }
  console.log(`Seeded ${sectors.length} sectors`);

  for (const company of companies) {
    const { investors, ...rest } = company;
    await prisma.company.upsert({
      where: { id: company.id },
      update: { ...rest, investors: JSON.stringify(investors) },
      create: { ...rest, investors: JSON.stringify(investors) },
    });
  }
  console.log(`Seeded ${companies.length} companies`);

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
