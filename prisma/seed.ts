import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required for seeding");
}

const pool = new Pool({
  connectionString,
  ssl: connectionString.includes("neon.tech")
    ? { rejectUnauthorized: false }
    : undefined,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const username = process.env.DOCTOR_USERNAME ?? "doctor";
  const password = process.env.DOCTOR_PASSWORD ?? "AcuActiv2026!";
  const name = process.env.DOCTOR_NAME ?? "Dr. Shlomi Gavish";
  const email = process.env.DOCTOR_EMAIL ?? "acuactiv@gmail.com";

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
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
