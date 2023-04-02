import { TokenBalances } from "./users";
import { CurrentUser } from "./users";

export interface FormFelid<T> {
  value: T;
  error: boolean;
  helperText: string;
  showPassword?: boolean;
}

export type AdminPasswordFormState = {
  email: FormFelid<string>;
  password: FormFelid<string>;
};

export type AdminUpdatePassword = {
  email?: string;
  password: string;
};

export type UpdatePasswordResponse = {
  message: string;
  user?: CurrentUser;
};

export type AdminLoginResponse = {
  message: string;
  user: CurrentUser;
  adminToken: string;
};

type TopupAmounts = {
  value: number;
  fee: number;
  total: number;
};

export type CreateTransactionEntity = {
  entityType: string;
  entityId?: string;
  senderId: string;
  amount: TopupAmounts;
};

export type CreateTransactionByteBody = {
  entity: CreateTransactionEntity;
  connectedAccountId: string;
};

export type SetTransactionBody = {
  entity: CreateTransactionEntity;
  transactionId: string;
};

export type TopUpResponse = {
  error?:boolean,
  message?:string,
  success?:boolean,
  available_budget?:number,
  balance?:TokenBalances
}