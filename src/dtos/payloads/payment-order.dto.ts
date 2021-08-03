export class PaymentOrderDto {
  action: 'AUTH' | 'SALE';
  amount: {
    currencyCode: string;
    value: number;
  };
  emailAddress: string;

  billingAddress: {
    firstName: string;
    lastName: string;
  };
}
