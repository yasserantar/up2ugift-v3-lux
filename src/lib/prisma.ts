import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const dbUrl = process.env.DATABASE_URL || "postgres://cad3bfa022248fc92c9681b3c5bb3cc3079e70c37200c7d9ee888d433a4740f7:sk_-5FnkPtMbYK9Tu-9PWA0J@db.prisma.io:5432/postgres?sslmode=require";

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    accelerateUrl: dbUrl,
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
