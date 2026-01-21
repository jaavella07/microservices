import { Injectable } from '@nestjs/common';

@Injectable()
export class DetailsService {
  getHello(): string {
    return 'Hello World!';
  }
}
