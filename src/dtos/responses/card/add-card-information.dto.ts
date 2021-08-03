import { NgeniusAmount, RLink, CuriesEntity } from "@app/dtos";

export class AddCardInformationDto {
  _id: string;
  _links: AddCardInfoResponseLinks;
  paymentMethod: AddCardInfoResponsePaymentMethod;
  outletId: string;
  orderReference: string;
  state: string;
  amount: NgeniusAmount;
  updateDateTime: string;
  authResponse: AddCardInfoAuthResponse;
  '3ds'?: any;
}
export class AddCardInfoResponseLinks {
  self: RLink;
  curies?: CuriesEntity[] | null;
}

export class AddCardInfoResponsePaymentMethod {
  expiry: string;
  cardholderName: string;
  name: string;
  pan: string;
  cvv: string;
}
export class AddCardInfoAuthResponse {
  authorizationCode: string;
  success: boolean;
}
