export class PaymentDto {
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
  pan: number;
  expiry: number;
  cvv: number;
  cardholderName: string;
}
