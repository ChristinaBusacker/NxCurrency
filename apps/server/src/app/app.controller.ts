import { Controller, Get } from '@nestjs/common';
@Controller()
export class AppController {

  // I keep that in to be able to make a request to check if the server is running
  // without fatching real data
  
  @Get()
  getData() {
    return { timestamp: new Date().getTime() }
  }
}
