import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  const cwd = process.cwd();
  const paths = [
    path.join(cwd, "prisma", "dev.db"),
    path.join(cwd, "prisma"),
    path.join(cwd, "..", "prisma", "dev.db"),
    "/var/task/prisma/dev.db",
    "/var/task/.next/server/prisma/dev.db",
  ];

  const results: Record<string, unknown> = {
    cwd,
    __dirname: __dirname,
    env_SQLITE_URL: process.env.SQLITE_URL,
  };

  for (const p of paths) {
    results[p] = fs.existsSync(p);
  }

  // List cwd contents
  try {
    results["cwd_contents"] = fs.readdirSync(cwd);
  } catch (e: unknown) {
    results["cwd_contents"] = String(e);
  }

  // List cwd/prisma if it exists
  const prismaDir = path.join(cwd, "prisma");
  try {
    results["prisma_dir_contents"] = fs.readdirSync(prismaDir);
  } catch (e: unknown) {
    results["prisma_dir_contents"] = String(e);
  }

  return NextResponse.json(results);
}
