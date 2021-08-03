import { InvoiceItemsDto, NgeniusAmount } from '@app/dtos';




export class CreateInvoiceDto {
  firstName: string;
  lastName: string;
  email: string;
  transactionType: 'AUTH' | 'SALE';
  emailSubject: string;
  invoiceExpiryDate: string;
  paymentAttempts?: number;
  redirectUrl?: string;
  items: InvoiceItemsDto[];
  total: NgeniusAmount;
  message: string;
}