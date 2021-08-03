
export class RLink {
  href: string;
}

export class NgeniusAmount {
  currencyCode: string;
  value: number;
}

export class CuriesEntity {
  name: string;
  href: string;
  templated: boolean;
}

export class InvoiceItemsDto {
  description: string;
  totalPrice: NgeniusAmount;
  quantity: number;
}

export class InitiateTokenResponseDto {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
}