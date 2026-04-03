import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { sectors } from "../src/data/sectors";
import { companies } from "../src/data/companies";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Seed default admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@saudivc.com" },
    update: {},
    create: {
      email: "admin@saudivc.com",
      name: "مدير النظام",
      hashedPassword: adminPassword,
      role: "admin",
    },
  });

  // Seed analyst user
  const analystPassword = await bcrypt.hash("analyst123", 12);
  await prisma.user.upsert({
    where: { email: "analyst@saudivc.com" },
    update: {},
    create: {
      email: "analyst@saudivc.com",
      name: "محلل استثماري",
      hashedPassword: analystPassword,
      role: "analyst",
    },
  });

  // Seed viewer user
  const viewerPassword = await bcrypt.hash("viewer123", 12);
  await prisma.user.upsert({
    where: { email: "viewer@saudivc.com" },
    update: {},
    create: {
      email: "viewer@saudivc.com",
      name: "مستعرض",
      hashedPassword: viewerPassword,
      role: "viewer",
    },
  });
  console.log("Seeded 3 default users (admin, analyst, viewer)");

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
