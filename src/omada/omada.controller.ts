import { Body, Controller, Post } from "@nestjs/common";
import { OmadaService } from "./omada.service";

@Controller("omada")
export class OmadaController {
  private svc: OmadaService;

  constructor() {
    this.svc = new OmadaService(
      process.env.OMADA_CONTROLLER_URL!,
      process.env.OMADA_USERNAME!,
      process.env.OMADA_PASSWORD!,
    );
  }

  @Post("authorize")
  async authorize(@Body() body: any) {
    // body должен включать clientMac, ssid, apMac и т.п. из запроса Omada → порталу
    const token = await this.svc.login();

    // Минимальный payload для авторизации (см. FAQ 3231/2907)
    const payload = {
      clientMac: body.clientMac,
      ssid: body.ssid,
      apMac: body.apMac,
      authType: 8, // тип «external portal»
      // можно добавить duration/параметры, если требуется
    };

    const res = await this.svc.authorize(token, payload);
    return { ok: true, omada: res.data };
  }
}
