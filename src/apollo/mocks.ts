import * as Factory from 'factory.ts';
import faker from 'faker';
import { MATCH_ANY_PARAMETERS, WildcardMockedResponse } from 'wildcard-mock-link';
import {
  GET_TRANSFERS_WITH_EVENTS,
  GET_TRANSFER_SUMMARY_BY_CURRENCY,
  GET_TRANSFER_SUMMARY_BY_PAYEE_DFSP,
  GET_TRANSFER_SUMMARY_BY_PAYER_DFSP,
  GET_TRANSFER_SUMMARY,
} from './query';
import {
  Transfer,
  DFSP,
  Party,
  PartyIdType,
  TransactionType,
  TransferState,
  TransferSummary,
} from './types';

export const PartyMock = Factory.Sync.makeFactory<Party>({
  __typename: 'Party',
  id: Factory.each(() => faker.datatype.number()),
  firstName: Factory.each(() => faker.name.firstName()),
  lastName: Factory.each(() => faker.name.lastName()),
  middleName: Factory.each(() => faker.name.middleName()),
  dateOfBirth: Factory.each(() => faker.datatype.datetime().toJSON()),
  idType: Factory.each(() =>
    faker.random.arrayElement([
      PartyIdType.Msisdn,
      PartyIdType.Email,
      PartyIdType.PersonalId,
      PartyIdType.Business,
      PartyIdType.Device,
      PartyIdType.AccountId,
      PartyIdType.Iban,
      PartyIdType.Alias,
    ]),
  ),
  idValue: Factory.each(() => faker.datatype.string()),
});

export const DfspMock = Factory.Sync.makeFactory<DFSP>({
  __typename: 'DFSP',
  id: Factory.each(() => faker.datatype.number()),
  name: Factory.each(() => faker.company.companyName()),
  description: Factory.each(() => faker.company.catchPhrase()),
  active: Factory.each(() => faker.datatype.boolean()),
  currencies: ['USD', 'EUR', 'CNY', 'MMK', 'TZS'],
});

export const TransferMock = Factory.Sync.makeFactory<Transfer>({
  __typename: 'Transfer',
  transferId: Factory.each(() => faker.datatype.uuid()),
  transactionId: Factory.each(() => faker.datatype.uuid()),
  quoteId: Factory.each(() => faker.datatype.uuid()),
  amount: Factory.each(() => faker.datatype.float()),
  currency: Factory.each(() => faker.random.arrayElement(['USD', 'EUR', 'CNY', 'MMK', 'TZS'])),
  createdAt: Factory.each(() => faker.datatype.datetime().toJSON()),
  transferState: Factory.each(() =>
    faker.random.arrayElement([
      TransferState.Aborted,
      TransferState.Committed,
      TransferState.Reserved,
      TransferState.Settled,
    ]),
  ),
  transactionType: Factory.each(() =>
    faker.random.arrayElement([
      TransactionType.Transfer,
      TransactionType.Deposit,
      TransactionType.Withdrawal,
      TransactionType.Payment,
      TransactionType.Refund,
    ]),
  ),
  settlementWindowId: Factory.each(() => faker.datatype.number()),
  settlementId: Factory.each(() => faker.datatype.number()),
  payerDFSP: Factory.each(() => DfspMock.build()),
  payeeDFSP: Factory.each(() => DfspMock.build()),
  payerParty: Factory.each(() => PartyMock.build()),
  payeeParty: Factory.each(() => PartyMock.build()),
  quoteEvents: Factory.each(() => {
    return JSON.parse(JSON.stringify({ data: faker.datatype.string(1000) }));
  }),
  partyLookupEvents: Factory.each(() => {
    return JSON.parse(faker.datatype.json());
  }),
  transferEvents: Factory.each(() => {
    return JSON.parse(faker.datatype.json());
  }),
  settlementEvents: Factory.each(() => {
    return JSON.parse(faker.datatype.json());
  }),
});

export const TransferSummaryMock = Factory.Sync.makeFactory<TransferSummary>({
  __typename: 'TransferSummary',
  count: Factory.each(() => faker.datatype.number()),
  payerDFSP: Factory.each(() => faker.company.companyName()),
  payeeDFSP: Factory.each(() => faker.company.companyName()),
  currency: Factory.each(() => faker.random.arrayElement(['USD', 'EUR', 'CNY', 'MMK', 'TZS'])),
  errorCode: Factory.each(() => faker.datatype.number()),
});

export const TransferSummaryMockByErrorCode = Factory.Sync.makeFactory<TransferSummary>({
  __typename: 'TransferSummary',
  count: Factory.each(() => faker.datatype.number()),
  errorCode: Factory.each(() => faker.datatype.number()),
});

export const TransferSummaryMockByCurrency = Factory.Sync.makeFactory<TransferSummary>({
  __typename: 'TransferSummary',
  count: Factory.each(() => faker.datatype.number()),
  currency: Factory.each(() => faker.datatype.string(3)),
  errorCode: Factory.each(() => faker.datatype.number()),
});

export const TransferSummaryMockByPayeeDFSP = Factory.Sync.makeFactory<TransferSummary>({
  __typename: 'TransferSummary',
  count: Factory.each(() => faker.datatype.number()),
  payeeDFSP: Factory.each(() => faker.company.companyName()),
  errorCode: Factory.each(() => faker.datatype.number()),
});

export const TransferSummaryMockByPayerDFSP = Factory.Sync.makeFactory<TransferSummary>({
  __typename: 'TransferSummary',
  count: Factory.each(() => faker.datatype.number()),
  payerDFSP: Factory.each(() => faker.company.companyName()),
  errorCode: Factory.each(() => faker.datatype.number()),
});

export const transfersQueryMock: WildcardMockedResponse = {
  request: {
    query: GET_TRANSFERS_WITH_EVENTS,
    variables: MATCH_ANY_PARAMETERS,
  },
  result: {
    data: {
      transfers: TransferMock.buildList(100),
      dfsps: [],
      transferSummary: [],
    },
  },
  nMatches: Number.POSITIVE_INFINITY,
};

export const transferSummary: WildcardMockedResponse = {
  request: {
    query: GET_TRANSFER_SUMMARY,
    variables: MATCH_ANY_PARAMETERS,
  },
  result: {
    data: {
      transfers: [],
      dfsps: [],
      transferSummary: [
        {
          count: 1000000,
          errorCode: null,
        },
        ...TransferSummaryMock.buildList(10),
      ],
    },
  },
  nMatches: Number.POSITIVE_INFINITY,
};

export const transferSummaryByCurrencyQueryMock: WildcardMockedResponse = {
  request: {
    query: GET_TRANSFER_SUMMARY_BY_CURRENCY,
    variables: MATCH_ANY_PARAMETERS,
  },
  result: {
    data: {
      transfers: [],
      dfsps: [],
      transferSummary: [
        {
          count: 1000000,
          currency: 'USD',
          errorCode: null,
        },
        {
          count: 1000000,
          currency: 'EUR',
          errorCode: null,
        },
        {
          count: 40000,
          currency: 'USD',
          errorCode: 3100,
        },
        ...TransferSummaryMockByCurrency.buildList(10),
      ],
    },
  },
  nMatches: Number.POSITIVE_INFINITY,
};

export const transferSummaryByPayerDFSPQueryMock: WildcardMockedResponse = {
  request: {
    query: GET_TRANSFER_SUMMARY_BY_PAYER_DFSP,
    variables: MATCH_ANY_PARAMETERS,
  },
  result: {
    data: {
      transfers: [],
      dfsps: [],
      transferSummary: [
        {
          count: 1000000,
          payerDFSP: 'dfspa',
          errorCode: null,
        },
        {
          count: 1000000,
          payerDFSP: 'dfspb',
          errorCode: null,
        },
        ...TransferSummaryMockByPayerDFSP.buildList(10),
      ],
    },
  },
  nMatches: Number.POSITIVE_INFINITY,
};

export const transferSummaryByPayeeDFSPQueryMock: WildcardMockedResponse = {
  request: {
    query: GET_TRANSFER_SUMMARY_BY_PAYEE_DFSP,
    variables: MATCH_ANY_PARAMETERS,
  },
  result: {
    data: {
      transfers: [],
      dfsps: [],
      transferSummary: [
        {
          count: 1000000,
          payeeDFSP: 'payeea',
          errorCode: null,
        },
        {
          count: 1000000,
          payeeDFSP: 'payeeb',
          errorCode: null,
        },
        ...TransferSummaryMockByPayeeDFSP.buildList(10),
      ],
    },
  },
  nMatches: Number.POSITIVE_INFINITY,
};
