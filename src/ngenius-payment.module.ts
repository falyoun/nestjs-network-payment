import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { NgeniusPaymentService } from './services/ngenius-payment.service';
import {
  NGEINUS_MODULE_OPTIONS,
  NGENIUS_AXIOS_INSTANCE_TOKEN,
} from '@app/ngenius-constants';
import axios from 'axios'
import {
  NgeniusModuleAsyncOptions,
  NgeniusModuleOptions,
  NgeniusModuleOptionsFactory,
} from '@app/interfaces';
import { NgeniusCommonService, NgeniusInvoiceService } from '@app/services';
@Global()
@Module({
  providers: [NgeniusPaymentService, NgeniusCommonService, NgeniusInvoiceService],
  exports: [NgeniusPaymentService],
})
export class NgeniusPaymentModule {
  static register(options: NgeniusModuleOptions): DynamicModule {
    return {
      module: NgeniusPaymentModule,
      providers: [
        {
          provide: NGENIUS_AXIOS_INSTANCE_TOKEN,
          useValue: axios.create({
            baseURL: options.baseUrl,
          }),
        },
        {
          provide: NGEINUS_MODULE_OPTIONS,
          useValue: options
        },
      ],
    };
  }



  static registerAsync(options: NgeniusModuleAsyncOptions): DynamicModule {
    return {
      module: NgeniusPaymentModule,
      imports: options.imports,
      providers: [
        ...this.createAsyncProviders(options),
        {
          provide: NGENIUS_AXIOS_INSTANCE_TOKEN,
          useFactory: (config: NgeniusModuleOptions) => axios.create({
            baseURL: config.baseUrl
          }),
          inject: [NGEINUS_MODULE_OPTIONS],
        },
        ...(options.extraProviders || []),
      ],
    };
  }




  private static createAsyncProviders(
    options: NgeniusModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: NgeniusModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: NGEINUS_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    return {
      provide: NGEINUS_MODULE_OPTIONS,
      useFactory: async (optionsFactory: NgeniusModuleOptionsFactory) =>
        optionsFactory.createNgeniusModuleOptions(),
      inject: [options.useExisting || options.useClass],
    };
  }

}
