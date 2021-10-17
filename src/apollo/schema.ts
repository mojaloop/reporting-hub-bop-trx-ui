import { SchemaLink } from '@apollo/client/link/schema';
import { makeExecutableSchema } from '@graphql-tools/schema';

import gql from 'graphql-tag';

export const typeDefs = gql`
  scalar DateTime
  scalar Date
  scalar NonEmptyString
  scalar JSONObject
  scalar Currency

  type Query {
    _placeholder: Boolean
    dfsps: [DFSP!]!
    transfer(transferId: String!): Transfer
    transfers(filter: TransferFilter!, limit: Int): [Transfer!]!
    transferSummary(filter: TransferSummaryFilter): [TransferSummary!]!
  }

  type Mutation {
    _placeholder: Boolean
  }

  # Date time (RFC 3339), can accept data in flexible form: 2007-12-03 or 2021-01-01T00:00:00Z
  scalar DateTimeFlexible

  type DFSP {
    id: Int!
    name: String!
    description: String!
    active: Boolean!
    currencies: [NonEmptyString!]!
  }

  input TransferFilter {
    startDate: DateTimeFlexible!
    endDate: DateTimeFlexible!
    errorCode: Int
    payer: PartyFilter
    payee: PartyFilter
    currency: Currency
    transferState: TransferState
    settlementWindowId: Int
    settlementId: Int
  }

  input PartyFilter {
    dfsp: String
    idType: PartyIDType
    idValue: String
  }

  type Transfer {
    transferId: String!
    transactionId: String
    quoteId: String
    amount: Int
    currency: Currency
    createdAt: String
    transferState: String
    transactionType: String
    errorCode: Int
    settlementWindowId: Int
    settlementId: Int
    payerDFSP: DFSP
    payeeDFSP: DFSP
    payerParty: Party
    payeeParty: Party
    partyLookupEvents: JSONObject
    quoteEvents: JSONObject
    transferEvents: JSONObject
    settlementEvents: JSONObject
  }

  enum TransactionType {
    TRANSFER
    DEPOSIT
    WITHDRAWAL
    PAYMENT
    REFUND
  }

  enum TransferState {
    ABORTED
    COMMITTED
    RESERVED
    SETTLED
  }

  type Party {
    id: Int
    firstName: String
    lastName: String
    middleName: String
    dateOfBirth: Date
    idType: PartyIDType
    idValue: String
  }

  enum PartyIDType {
    MSISDN
    EMAIL
    PERSONAL_ID
    BUSINESS
    DEVICE
    ACCOUNT_ID
    IBAN
    ALIAS
  }

  input TransferSummaryFilter {
    startDate: DateTimeFlexible
    endDate: DateTimeFlexible
    errorCode: Int
    payerDFSP: String
    payeeDFSP: String
    currency: Currency
  }

  type TransferSummary {
    count: Int!
    amount: Int!
    errorCode: Int
    payerDFSP: String
    payeeDFSP: String
    currency: Currency
  }
`;

export const schemaLink = new SchemaLink({ schema: makeExecutableSchema({ typeDefs }) });
