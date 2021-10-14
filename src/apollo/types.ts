// https://www.graphql-code-generator.com/
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
  Date: any;
  NonEmptyString: any;
  JSONObject: any;
  Currency: any;
  DateTimeFlexible: any;
};

export type Query = {
  __typename?: 'Query';
  _placeholder?: Maybe<Scalars['Boolean']>;
  dfsps: Array<DFSP>;
  transfer?: Maybe<Transfer>;
  transfers: Array<Transfer>;
  transferSummary: Array<TransferSummary>;
};

export type QueryTransferArgs = {
  transferId: Scalars['String'];
};

export type QueryTransfersArgs = {
  filter: TransferFilter;
  limit?: Maybe<Scalars['Int']>;
};

export type QueryTransferSummaryArgs = {
  filter?: Maybe<TransferSummaryFilter>;
};

export type Mutation = {
  __typename?: 'Mutation';
  _placeholder?: Maybe<Scalars['Boolean']>;
};

export type DFSP = {
  __typename?: 'DFSP';
  id: Scalars['Int'];
  name: Scalars['String'];
  description: Scalars['String'];
  active: Scalars['Boolean'];
  currencies: Array<Scalars['NonEmptyString']>;
};

export type TransferFilter = {
  startDate: Scalars['DateTimeFlexible'];
  endDate: Scalars['DateTimeFlexible'];
  errorCode?: Maybe<Scalars['Int']>;
  payer?: Maybe<PartyFilter>;
  payee?: Maybe<PartyFilter>;
  currency?: Maybe<Scalars['Currency']>;
  transferState?: Maybe<TransferState>;
  settlementWindowId?: Maybe<Scalars['Int']>;
  settlementId?: Maybe<Scalars['Int']>;
};

export type PartyFilter = {
  dfsp?: Maybe<Scalars['String']>;
  idType?: Maybe<PartyIdType>;
  idValue?: Maybe<Scalars['String']>;
};

export type Transfer = {
  __typename?: 'Transfer';
  transferId: Scalars['String'];
  transactionId?: Maybe<Scalars['String']>;
  quoteId?: Maybe<Scalars['String']>;
  amount?: Maybe<Scalars['Int']>;
  currency?: Maybe<Scalars['Currency']>;
  createdAt?: Maybe<Scalars['String']>;
  transferState?: Maybe<Scalars['String']>;
  transactionType?: Maybe<Scalars['String']>;
  errorCode?: Maybe<Scalars['Int']>;
  settlementWindowId?: Maybe<Scalars['Int']>;
  settlementId?: Maybe<Scalars['Int']>;
  payerDFSP?: Maybe<DFSP>;
  payeeDFSP?: Maybe<DFSP>;
  payerParty?: Maybe<Party>;
  payeeParty?: Maybe<Party>;
  partyLookupEvents?: Maybe<Scalars['JSONObject']>;
  quoteEvents?: Maybe<Scalars['JSONObject']>;
  transferEvents?: Maybe<Scalars['JSONObject']>;
  settlementEvents?: Maybe<Scalars['JSONObject']>;
};

export enum TransactionType {
  Transfer = 'TRANSFER',
  Deposit = 'DEPOSIT',
  Withdrawal = 'WITHDRAWAL',
  Payment = 'PAYMENT',
  Refund = 'REFUND',
}

export enum TransferState {
  Aborted = 'ABORTED',
  Committed = 'COMMITTED',
  Reserved = 'RESERVED',
  Settled = 'SETTLED',
}

export type Party = {
  __typename?: 'Party';
  id?: Maybe<Scalars['Int']>;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  middleName?: Maybe<Scalars['String']>;
  dateOfBirth?: Maybe<Scalars['Date']>;
  idType?: Maybe<PartyIdType>;
  idValue?: Maybe<Scalars['String']>;
};

export enum PartyIdType {
  Msisdn = 'MSISDN',
  Email = 'EMAIL',
  PersonalId = 'PERSONAL_ID',
  Business = 'BUSINESS',
  Device = 'DEVICE',
  AccountId = 'ACCOUNT_ID',
  Iban = 'IBAN',
  Alias = 'ALIAS',
}

export type TransferSummaryFilter = {
  startDate?: Maybe<Scalars['DateTimeFlexible']>;
  endDate?: Maybe<Scalars['DateTimeFlexible']>;
  errorCode?: Maybe<Scalars['Int']>;
  payerDFSP?: Maybe<Scalars['String']>;
  payeeDFSP?: Maybe<Scalars['String']>;
  currency?: Maybe<Scalars['Currency']>;
};

export type TransferSummary = {
  __typename?: 'TransferSummary';
  count: Scalars['Int'];
  amount: Scalars['Int'];
  errorCode?: Maybe<Scalars['Int']>;
  payerDFSP?: Maybe<Scalars['String']>;
  payeeDFSP?: Maybe<Scalars['String']>;
  currency?: Maybe<Scalars['Currency']>;
};
