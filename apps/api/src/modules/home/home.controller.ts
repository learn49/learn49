import { Controller, Get } from '@nestjs/common';

@Controller()
export class HomeController {
  @Get('/')
  index(): string {
    return 'Learn49 API';
  }
}
