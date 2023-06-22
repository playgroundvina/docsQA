import { Test, TestingModule } from '@nestjs/testing';
import ModelController from './chatgpt.controller';
import ModelService from './chatgpt.service';

describe('RoleController', () => {
  let controller: ModelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ModelController],
      providers: [ModelService],
    }).compile();

    controller = module.get<ModelController>(ModelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
