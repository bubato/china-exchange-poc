export interface PaymentAccount {
  paymentMethodId: string,
  name: string,
  accountNo: string,
  accountOwnerName: string,
  dailyLimit: number,
  qrCodeUrl: string,
  paymentMethod: any
}
