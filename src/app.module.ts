import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PaymentsModule } from "./payments/payments.module";
import { OmadaModule } from "./omada/omada.module";
import { PlansModule } from "./plans/plans.module";

@Module({
  imports: [PaymentsModule, OmadaModule, PlansModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
