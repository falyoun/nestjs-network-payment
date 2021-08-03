import {Inject, Injectable} from '@nestjs/common';
import {
  INITIATE_ORDER_URL,
  NGEINUS_MODULE_OPTIONS,
  NGENIUS_AXIOS_INSTANCE_TOKEN,
  NGENIUS_HEADERS_JSON_TYPE,
} from '@app/ngenius-constants';
import {AxiosInstance} from 'axios';
import {
  AddCardInformationDto, NgeniusAmount, CreatePaymentDto,
  InitiatePaymentOrderResponse,
  OrderDetails, PaymentCheckoutDto,
  PaymentDto,
  PaymentOrderDto,
} from '@app/dtos';
import {NgeniusErrorsConstants} from '@app/errors';
import {NgeniusModuleOptions} from '@app/interfaces';
import {NgeniusCommonService} from '@app/services';


@Injectable()
export class NgeniusPaymentService {

  constructor(
    @Inject(NGENIUS_AXIOS_INSTANCE_TOKEN) private readonly axiosInstance: AxiosInstance,
    @Inject(NGEINUS_MODULE_OPTIONS) private readonly ngeniusModuleOptions: NgeniusModuleOptions,
    private ngeniusCommonService: NgeniusCommonService,
  ) {
  }

  public async handle3DSFormSubmitted(
    cnp3dsLink: string,
    token: string,
    payload: { PaRes: string; MD: string },
  ) {
    const headers = {
      Authorization: `Bearer ${token}`,
      ...NGENIUS_HEADERS_JSON_TYPE,
    };
    return await this.axiosInstance
      .post(cnp3dsLink, payload, {headers})
      .then((r) => r.data);
  }


  private async _initiateOrder(
    paymentDto: PaymentDto,
    token: string,
  ): Promise<InitiatePaymentOrderResponse> {
    const initiateOrderUrl = INITIATE_ORDER_URL(this.ngeniusModuleOptions.outletReference);
    const orderData: PaymentOrderDto = {
      action: paymentDto.action || 'SALE',
      amount: paymentDto.amount,
      billingAddress: paymentDto.billingAddress,
      emailAddress: paymentDto.emailAddress,
    };
    return this.axiosInstance
      .post(initiateOrderUrl, orderData, {
        headers: {
          ...this.axiosInstance.defaults.headers,
          Authorization: `Bearer ${token}`,
          ...NGENIUS_HEADERS_JSON_TYPE,
        },
      })
      .then((d) => d.data)
      .catch(e => {
        throw {
          ...NgeniusErrorsConstants.INITIATE_ORDER_FAILED,
          error: e,
        };
      });
  }

  private async _addCardInformation(
    orderResponse: InitiatePaymentOrderResponse,
    paymentDto: PaymentDto,
    token: string,
  ): Promise<AddCardInformationDto> {
    const paymentURL = orderResponse._embedded.payment[0]._links[`payment:card`].href;
    const paymentCheckoutData: PaymentCheckoutDto = {
      cvv: paymentDto.cvv,
      pan: paymentDto.pan,
      cardholderName: paymentDto.cardholderName,
      expiry: paymentDto.expiry,
    } as PaymentCheckoutDto;
    return await this.axiosInstance
      .put(paymentURL, paymentCheckoutData, {
        headers: {
          ...this.axiosInstance.defaults.headers,
          Authorization: `Bearer ${token}`,
          ...NGENIUS_HEADERS_JSON_TYPE,
        },
      })
      .then((r) => r.data)
      .catch(e => {
        throw {
          ...NgeniusErrorsConstants.ADD_CARD_INFORMATION_FAILED,
          error: e,
        };
      });
  }

  // Two stage payments
  // As first request to initiate order
  // Second request to add card information
  async createPayment(paymentDto: PaymentDto): Promise<CreatePaymentDto> {
    try {
      const initiateTokenResponseDto = await this.ngeniusCommonService.getAccessToken();
      const token = initiateTokenResponseDto.access_token;
      const initiateOrderResponse = await this._initiateOrder(paymentDto, token);
      const addCardInfoResponse = await this._addCardInformation(
        initiateOrderResponse,
        paymentDto,
        token,
      );
      if (addCardInfoResponse['state'] === 'AWAIT_3DS') {
        const process3DSResponse = await this._process3DS(addCardInfoResponse, token);
        return {
          addCardInformationResponse: addCardInfoResponse,
          initiateOrderResponse,
          token,
          html: process3DSResponse.html,
        };
      }
      return {
        addCardInformationResponse: addCardInfoResponse,
        initiateOrderResponse: initiateOrderResponse,
        token: token,
      };
    } catch (e) {
      console.log({e});
      throw e;
    }
  }

  private async _process3DS(
    addCardInfoResponse: AddCardInformationDto,
    token: string,
  ) {
    if (addCardInfoResponse['3ds']) {
      const dataFor3DS = addCardInfoResponse['3ds'];
      const cnp3dsLink = addCardInfoResponse._links['cnp:3ds'].href;
      const termUrl = `https://api.lamar-clinic.com/orders/submit-payment-3ds?cnp3dsLink=${cnp3dsLink}&token=${token}`;
      const params = new URLSearchParams();
      params.append('PaReq', dataFor3DS['acsPaReq']);
      params.append('MD', dataFor3DS['acsMd']);
      params.append('TermUrl', termUrl);

      return await this.axiosInstance
        .post(dataFor3DS['acsUrl'], params, {
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          },
        })
        .then(async (res) => {
          return {
            html: res.data,
          };
        });
    }
    return null;
  }


  // Retrieve Order Status
  retrieveOrderStatus(orderReference: string, token: string): Promise<OrderDetails> {
    const url = `https://api-gateway.sandbox.ngenius-payments.com/transactions/outlets/${this.ngeniusModuleOptions.outletReference}/orders/${orderReference}`;
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    return this.axiosInstance.get(url, {
      headers,
    }).then(r => r.data);
  }


  // Capture an authorized payment
  // To 'capture' an authorized payment means to make the payment ready for settlement,
  // which is the process by which funds are transferred from your customer to your account overnight.
  async captureAuthorizedPayment(
    token: string,
    orderReference: string,
    paymentReference: string,
    data: {
      amount: NgeniusAmount
    },
  ) {

    const resourceUrl = `https://api-gateway.sandbox.ngenius-payments.com/transactions/outlets/${this.ngeniusModuleOptions.outletReference}/orders/${orderReference}/payments/${paymentReference}/captures`;
    // Or
    // Dynamic resource (order JSON; ‘index’ will be zero unless recurring payment):
    // response._embedded.payment[index]._links.[“cnp:capture”].href

    const headers = {
      Authorization: `Bearer ${token}`,
      ...NGENIUS_HEADERS_JSON_TYPE,
    };

    return await this.axiosInstance.post(resourceUrl, data, {
      headers,
    }).then(r => r.data);
  }


  // Reversing an authorized payment
  async reverseAuthorizedPayment(token: string,
                                 orderReference: string,
                                 paymentReference: string) {


    const resourceUrl = `https://api-gateway.sandbox.ngenius-payments.com/transactions/outlets/${this.ngeniusModuleOptions.outletReference}/orders/${orderReference}/payments/${paymentReference}/cancel`;

    // Or
    // Dynamic resource from order object:
    // response._embedded.payment[index]._links.[“cnp:cancel”].href

    const headers = {
      Authorization: `Bearer ${token}`,
      ...NGENIUS_HEADERS_JSON_TYPE,
    };

    return await this.axiosInstance.put(resourceUrl, {}, {
      headers,
    }).then(r => r.data);
  }


  // Refund a capture
  async refundCapturedPayment(token: string,
                              orderReference: string,
                              paymentReference: string,
                              captureReference: string,
                              data: NgeniusAmount) {
    const resourceUrl = `https://api-gateway.sandbox.ngenius-payments.com/transactions/outlets/${this.ngeniusModuleOptions.outletReference}/orders/${orderReference}/payments/${paymentReference}/captures/${captureReference}/refund`;


    // Or
    // Dynamic resource from order object:
    // response._embedded.payment[index]._embedded.[“cnp:capture”][index]._links.[“cnp:refund”].hre


    const headers = {
      Authorization: `Bearer ${token}`,
      ...NGENIUS_HEADERS_JSON_TYPE,
    };

    return await this.axiosInstance.post(resourceUrl, data, {
      headers,
    }).then(r => r.data);
  }

  // Cancel a capture request
  async cancelCapturedPayment(
    token: string,
    orderReference: string,
    paymentReference: string,
    captureReference: string,
  ) {
    const resourceUrl = `https://api-gateway.sandbox.ngenius-payments.com/transactions/outlets/${this.ngeniusModuleOptions.outletReference}/orders/${orderReference}/payments/${paymentReference}/captures/${captureReference}`;


    const headers = {
      Authorization: `Bearer ${token}`,
      ...NGENIUS_HEADERS_JSON_TYPE,
    };

    // Or
    // Dynamic resource from order object:
    // response._embedded.payment[index]._embedded.[“cnp:capture”][index]._links.self.href

    return await this.axiosInstance.delete(resourceUrl, {
      headers,
    }).then(r => r.data);
  }


  // Cancel a refund request
  async cancelRefundRequest(
    token: string,
    orderReference: string,
    paymentReference: string,
    refundReference: string,
  ) {
    const resourceUrl = `https://api-gateway.sandbox.ngenius-payments.com/transactions/outlets/${this.ngeniusModuleOptions.outletReference}/orders/${orderReference}/payments/${paymentReference}/refunds/${refundReference}`;

    // Or
    // Dynamic resource from order object:
    // response._embedded.payment[index]._embedded.[“cnp:refund”][index]._links.self.href


    const headers = {
      Authorization: `Bearer ${token}`,
      ...NGENIUS_HEADERS_JSON_TYPE,
    };


    return await this.axiosInstance.delete(resourceUrl, {
      headers,
    }).then(r => r.data);

  }
}