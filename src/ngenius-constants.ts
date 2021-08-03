export const NGENIUS_AXIOS_INSTANCE_TOKEN = 'ngenius_axios_instance_token';
export const NGEINUS_MODULE_OPTIONS = 'ngenius_module_options';
export const NGENIUS_HEADERS_JSON_TYPE = {
  'Content-Type': `application/vnd.ni-payment.v2+json`,
  Accept: `application/vnd.ni-payment.v2+json`,
};
export const NGENIUS_INVOICE_HEADERS_JSON_TYPE = {
  'Content-Type': `application/vnd.ni-invoice.v1+json`,
};
export const NGENIUS_AUTHORIZATION_HEADERS = {
  'Content-Type': 'application/vnd.ni-identity.v1+json',
};


export const INITIATE_TOKEN_URL =
  'https://api-gateway.sandbox.ngenius-payments.com/identity/auth/access-token';
export const INITIATE_ORDER_URL = (outlet: string) => `https://api-gateway.sandbox.ngenius-payments.com/transactions/outlets/${outlet}/orders`;