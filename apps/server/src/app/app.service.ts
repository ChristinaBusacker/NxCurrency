import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {

  constructor(private configService: ConfigService) {

  }

  getData(): { message: string } {
    return { message: this.configService.get<string>('FREECURRENCYAPI_KEY') };
  }
}
