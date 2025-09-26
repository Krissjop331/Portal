import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true, // отражает Origin клиента (http://localhost:3000)
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
  });

  const port = parseInt(process.env.PORT || "3001", 10);
  await app.listen(port, "0.0.0.0");
  console.log(`API: http://localhost:${port}`);
}
bootstrap();
