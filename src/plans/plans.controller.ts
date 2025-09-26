import { Controller, Get } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

@Controller("plans")
export class PlansController {
  @Get()
  async list() {
    return prisma.plan.findMany({ orderBy: { hours: "asc" } });
  }
}
