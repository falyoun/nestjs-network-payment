import { NgeniusAmount, CuriesEntity, RLink } from '@app/dtos';

export class MerchantAttributes {
  redirectUrl: string;
}


export class PaymentMethods {
  card?:
    | (
    | 'DINERS_CLUB_INTERNATIONAL'
    | 'AMERICAN_EXPRESS'
    | 'MASTERCARD'
    | 'VISA'
    )[]
    | null;
  wallet?: ('APPLE_PAY' | 'SAMSUNG_PAY')[] | null;
}


export class NgeniusOrderLinks {
  'cnp:payment-link': RLink;
  'payment-authorization': RLink;
  self: RLink;
  'tenant-brand': RLink;
  payment: RLink;
  'merchant-brand': RLink;
}



export interface NgeinusEmbeddedPaymentEntities {
  payment?: (PaymentEntity)[] | null;
}
export interface PaymentEntity {
  _id: string;
  _links: PaymentEntityLink;
  outletId: string;
  orderReference: string;
  state: string;
  amount: NgeniusAmount;
  updateDateTime: string;
}

export interface PaymentEntityLink {
  'payment:apple_pay': RLink;
  self: RLink;
  'payment:card': RLink;
  'payment:samsung_pay': RLink;
  'payment:saved-card': RLink;
  curies?: CuriesEntity[] | null;
}
