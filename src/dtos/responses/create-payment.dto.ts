import { AddCardInformationDto, InitiatePaymentOrderResponse } from '@app/dtos';


export class CreatePaymentDto {
  initiateOrderResponse: InitiatePaymentOrderResponse;
  addCardInformationResponse: AddCardInformationDto;
  token: string;
  html?: string;
}