import { Module } from '@nestjs/common';
import { OmadaService } from './omada.service';
import { OmadaController } from './omada.controller';

@Module({
  controllers: [OmadaController],
  providers: [OmadaService],
})
export class OmadaModule {}
