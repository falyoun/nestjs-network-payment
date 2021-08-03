import { Inject, Injectable } from '@nestjs/common';
import { InitiateTokenResponseDto } from '@app/dtos';
import {
  INITIATE_TOKEN_URL, NGEINUS_MODULE_OPTIONS,
  NGENIUS_AUTHORIZATION_HEADERS,
  NGENIUS_AXIOS_INSTANCE_TOKEN,
} from '@app/ngenius-constants';
import { NgeniusErrorsConstants } from '@app/errors';
import { AxiosInstance } from 'axios';
import { NgeniusModuleOptions } from '@app/interfaces';


@Injectable()
export class NgeniusCommonService {

  constructor(
    @Inject(NGENIUS_AXIOS_INSTANCE_TOKEN) private readonly axiosInstance: AxiosInstance,
    @Inject(NGEINUS_MODULE_OPTIONS) private readonly ngeniusModuleOptions: NgeniusModuleOptions,
  ) {
  }

  public async getAccessToken(): Promise<InitiateTokenResponseDto> {
    return await this.axiosInstance
      .post(
        INITIATE_TOKEN_URL,
        {},
        {
          headers: {
            ...this.axiosInstance.defaults.headers,
            Authorization: `Basic ${this.ngeniusModuleOptions.ngeniusApiKey}`,
            ...NGENIUS_AUTHORIZATION_HEADERS,
          },
        },
      )
      .then(async (res) => {
        return res.data;
      })
      .catch(e => {
        throw {
          ...NgeniusErrorsConstants.INVALID_CREDENTIALS,
          error: e,
        };
      });
  }
}