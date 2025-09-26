import { Test, TestingModule } from '@nestjs/testing';
import { OmadaController } from './omada.controller';
import { OmadaService } from './omada.service';

describe('OmadaController', () => {
  let controller: OmadaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OmadaController],
      providers: [OmadaService],
    }).compile();

    controller = module.get<OmadaController>(OmadaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
