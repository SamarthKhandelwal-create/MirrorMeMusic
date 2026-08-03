import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set. See .env.example.");
  }
  return new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
}

// Reused across warm serverless invocations so each request doesn't open a new
// connection. On Vercel, DATABASE_URL should be a POOLED connection string.
export const prisma = globalForPrisma.prisma ?? createClient();

globalForPrisma.prisma = prisma;
