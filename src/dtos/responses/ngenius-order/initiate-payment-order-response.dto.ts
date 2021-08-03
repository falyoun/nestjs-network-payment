import {
  MerchantAttributes,
  NgeinusEmbeddedPaymentEntities,
  NgeniusOrderLinks,
  PaymentMethods,
  NgeniusAmount
} from '@app/dtos';

export class InitiatePaymentOrderResponse {
  _id: string;
  _links: NgeniusOrderLinks;
  action: 'AUTH' | 'SALE';
  amount: NgeniusAmount;
  language: string;
  merchantAttributes: MerchantAttributes;
  emailAddress: string;
  reference: string;
  outletId: string;
  createDateTime: string;
  paymentMethods: PaymentMethods;
  referrer: string;
  formattedAmount: string;
  formattedOrderSummary: any;
  _embedded: NgeinusEmbeddedPaymentEntities;
}