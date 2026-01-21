import { Test, TestingModule } from '@nestjs/testing';
import { DetailsController } from './details.controller';
import { DetailsService } from './details.service';

describe('DetailsController', () => {
  let detailsController: DetailsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [DetailsController],
      providers: [DetailsService],
    }).compile();

    detailsController = app.get<DetailsController>(DetailsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(detailsController.getHello()).toBe('Hello World!');
    });
  });
});
