import { Inject, Injectable } from '@nestjs/common';
import {
  NGEINUS_MODULE_OPTIONS,
  NGENIUS_AXIOS_INSTANCE_TOKEN,
  NGENIUS_INVOICE_HEADERS_JSON_TYPE,
} from '@app/ngenius-constants';
import { NgeniusModuleOptions } from '@app/interfaces';
import { CreateInvoiceDto, InvoiceCreationResponse } from '@app/dtos';
import { AxiosInstance } from 'axios';
import { NgeniusErrorsConstants } from '@app/errors';


@Injectable()
export class NgeniusInvoiceService {

  constructor(
    @Inject(NGEINUS_MODULE_OPTIONS) private readonly ngeniusModuleOptions: NgeniusModuleOptions,
    @Inject(NGENIUS_AXIOS_INSTANCE_TOKEN) private readonly axiosInstance: AxiosInstance,
  ) {
  }

  async createInvoice(token: string,
                      payload: CreateInvoiceDto): Promise<InvoiceCreationResponse> {
    const resourceUrl = `https://api-gateway.sandbox.ngenius-payments.com/invoices/outlets/${this.ngeniusModuleOptions.outletReference}/invoice`;
    const headers = {
      Authorization: `Bearer ${token}`,
      ...NGENIUS_INVOICE_HEADERS_JSON_TYPE,
    };
    return this.axiosInstance.post(resourceUrl, payload, {
      headers,
    }).then(r => r.data).catch(e => {
      throw {
        native_error: e,
        ...NgeniusErrorsConstants.CREATE_INVOICE_FAILED,
      };
    });
  }
}