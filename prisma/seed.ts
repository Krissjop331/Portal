import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const plans = [
    { id: "p1", name: "1 час", hours: 1, price: 0 },
    { id: "p3", name: "3 часа", hours: 3, price: 700 },
    { id: "p8", name: "8 часов", hours: 8, price: 1200 },
    { id: "p24", name: "24 часа", hours: 24, price: 2000 },
  ];
  for (const p of plans) {
    await prisma.plan.upsert({ where: { id: p.id }, update: {}, create: p });
  }
}
main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
