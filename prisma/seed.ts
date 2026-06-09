import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";

const url = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
const adapter = new PrismaBetterSqlite3({ url });
const prisma = new PrismaClient({ adapter });

async function main() {
  const username = process.env.DOCTOR_USERNAME ?? "doctor";
  const password = process.env.DOCTOR_PASSWORD ?? "AcuActiv2026!";
  const name = process.env.DOCTOR_NAME ?? "Dr. Shlomi Gavish";
  const email = process.env.DOCTOR_EMAIL ?? "info@acuactiv.com";

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.doctor.upsert({
    where: { username },
    create: {
      username,
      passwordHash,
      name,
      email,
      clinicName: "AcuActiv",
    },
    update: {
      passwordHash,
      name,
      email,
    },
  });

  console.log(`Doctor portal user ready: ${username}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
