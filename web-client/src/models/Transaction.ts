import { PaymentMethod } from "./PaymentMethodModal";

export interface Transaction {
  _id: string,
  createdAt: string,
  status: string,
  amount: number,
  paymentMethod: PaymentMethod,
  receiverAccount: {
    accountNo: string,
    accountOwnerName: string,
    name: string,
    qrCodeUrl?: string,
    _id: string
  }
  updatedAt: string,
  senderAccountInfo: string,
  commission: number,
  payAble: number,
  merchandiser: {
    _id: string,
    name: string
  },
  deposit: number,
  commision: number

}
