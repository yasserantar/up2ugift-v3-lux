import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL || "postgres://cad3bfa022248fc92c9681b3c5bb3cc3079e70c37200c7d9ee888d433a4740f7:sk_-5FnkPtMbYK9Tu-9PWA0J@db.prisma.io:5432/postgres?sslmode=require",
  },
})
