import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getWelcome(): object {
    return {
      message: 'Welcome to Biz-Flow API',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth(): object {
    return {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }
}
