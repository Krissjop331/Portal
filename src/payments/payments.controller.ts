import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { PaymentsService } from "./payments.service";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

@Controller("payments")
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post("create")
  async create(@Body() body: any) {
    const { planId, meta } = body ?? {};
    const plan = await prisma.plan.findUnique({ where: { id: planId } });
    4;
    if (!plan) throw new Error("Unknown plan");
    const deviceMac = meta?.clientMac ?? "unknown";
    const pay = await prisma.payment.create({
      data: {
        planId,
        deviceMac,
        amount: plan.price,
        status: "pending",
        provider: "stub",
      },
    });

    const paymentUrl = `https://httpstat.us/200?s=kaspi_stub_${pay.id}`;
    return { paymentId: pay.id, paymentUrl };
  }

  @Post("webhook")
  @HttpCode(200)
  async webhook(@Body() body: any) {
    const { paymentId, providerTxId, deviceMac } = body;
    const pay = await prisma.payment.update({
      where: { id: paymentId },
      data: { status: "paid", paidAt: new Date(), providerTxId },
    });

    // создаём сессию на оплаченные часы и (далее) вызываем Omada extPortal/auth
    const plan = await prisma.plan.findUnique({ where: { id: pay.planId } });
    const start = new Date();
    const end = new Date(start.getTime() + plan!.hours * 3600 * 1000);
    await prisma.session.create({
      data: {
        deviceMac: deviceMac ?? pay.deviceMac,
        planId: plan!.id,
        startAt: start,
        endAt: end,
        source: "omada",
      },
    });

    // TODO: вызвать authorize в Omada (см. контроллер ниже)
    return { ok: true };
  }
}
