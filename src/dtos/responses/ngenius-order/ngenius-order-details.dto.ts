import {
  NgeniusAmount,
  MerchantAttributes, NgeinusEmbeddedPaymentEntities,
  NgeniusOrderLinks,
  PaymentMethods,
} from '@app/dtos';

export interface OrderDetails {
  _id: string;
  _links: NgeniusOrderLinks;
  action: string;
  amount: NgeniusAmount;
  language: string;
  merchantAttributes: MerchantAttributes;
  reference: string;
  outletId: string;
  createDateTime: string;
  paymentMethods: PaymentMethods;
  formattedOrderSummary: any;
  formattedAmount: string;
  _embedded: NgeinusEmbeddedPaymentEntities;
}

