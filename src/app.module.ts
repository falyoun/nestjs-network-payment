import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from "@nestjs/config";
import configurations from './configurations';
import { NgeniusPaymentModule } from './ngenius-payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [configurations],
    }),
    NgeniusPaymentModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          ...configService.get('ngeniusModuleInterface')
        }
      }
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
