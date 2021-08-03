import { InvoiceItemsDto, NgeniusAmount, RLink } from '@app/dtos';

export interface InvoiceCreationResponse {
  _links: InvoiceCreationLinks;
  emailSubject: string;
  invoiceExpiryDate: string;
  locale: string;
  reference: string;
  outletRef: string;
  orderReference: string;
  firstName: string;
  lastName: string;
  email: string;
  transactionType: string;
  items?: (InvoiceItemsDto)[] | null;
  total: NgeniusAmount;
  message: string;
}

export interface InvoiceCreationLinks {
  self: RLink;
  payment: RLink;
  'email-data': RLink;
  resend: RLink;
}

