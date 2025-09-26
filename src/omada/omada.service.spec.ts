import { Test, TestingModule } from '@nestjs/testing';
import { OmadaService } from './omada.service';

describe('OmadaService', () => {
  let service: OmadaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OmadaService],
    }).compile();

    service = module.get<OmadaService>(OmadaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
