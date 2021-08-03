import { ModuleMetadata, Provider, Type } from '@nestjs/common';

export type NgeniusModuleOptions = {
  ngeniusApiKey: string;
  outletReference: string;
  baseUrl?: string;
};

export interface NgeniusModuleOptionsFactory {
  createNgeniusModuleOptions(): Promise<NgeniusModuleOptions> | NgeniusModuleOptions;
}

export interface NgeniusModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<NgeniusModuleOptionsFactory>;
  useClass?: Type<NgeniusModuleOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<NgeniusModuleOptions> | NgeniusModuleOptions;
  inject?: any[];
  extraProviders?: Provider[];
}