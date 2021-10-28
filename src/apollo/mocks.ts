import * as Factory from 'factory.ts';
import faker from 'faker';
import { MockedResponse } from '@apollo/client/testing';
import moment from 'moment';
import {
  GET_TRANSFERS_WITH_EVENTS,
  GET_TRANSFER_SUMMARY_BY_CURRENCY,
  GET_TRANSFER_SUMMARY_BY_PAYEE_DFSP,
  GET_TRANSFER_SUMMARY_BY_PAYER_DFSP,
  GET_TRANSFER_SUMMARY_ERRORS_BY_PAYEE_DFSP,
  GET_TRANSFER_SUMMARY_ERRORS_BY_CURRENCY,
  GET_TRANSFER_SUMMARY_ERRORS_BY_PAYER_DFSP,
  GET_TRANSFER_SUMMARY,
} from './query';
import { Transfer, Query, DFSP, Party, PartyIdType, TransactionType, TransferState } from './types';

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
    return JSON.parse(faker.datatype.json());
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

export const transfersQueryMock: MockedResponse<Query> = {
  request: {
    query: GET_TRANSFERS_WITH_EVENTS,
    variables: {
      startDate: moment().subtract(1, 'month').toString(),
      endDate: moment().toString(),
    },
  },
  result: {
    data: {
      transfers: TransferMock.buildList(100),
      dfsps: [],
      transferSummary: [],
    },
  },
};

export const transferSummaryByCurrencyQueryMock: MockedResponse<Query> = {
  request: {
    query: GET_TRANSFER_SUMMARY_BY_CURRENCY,
    variables: {},
  },
  result: {
    data: {
      transfers: [],
      dfsps: [],
      transferSummary: [
        {
          count: 9,
          currency: 'TZS',
        },
        {
          count: 36,
          currency: 'USD',
        },
        {
          count: 5,
          currency: 'CAD',
        },
        {
          count: 56,
          currency: 'EUR',
        },
        {
          count: 4,
          currency: 'YEN',
        },
        {
          count: 2,
          currency: 'CYN',
        },
      ],
    },
  },
};

export const transferSummaryByPayerDFSPQueryMock: MockedResponse<Query> = {
  request: {
    query: GET_TRANSFER_SUMMARY_BY_PAYER_DFSP,
    variables: {},
  },
  result: {
    data: {
      transfers: [],
      dfsps: [],
      transferSummary: [
        {
          count: 6,
          payerDFSP: 'payeefsp',
        },
        {
          count: 4,
          payerDFSP: 'payerfsp',
        },
        {
          count: 8,
          payerDFSP: 'testfsp1',
        },
        {
          count: 4,
          payerDFSP: 'testfsp2',
        },
        {
          count: 23,
          payerDFSP: 'testingtoolkitdfsp',
        },
      ],
    },
  },
};

export const transferSummaryByPayeeDFSPQueryMock: MockedResponse<Query> = {
  request: {
    query: GET_TRANSFER_SUMMARY_BY_PAYEE_DFSP,
    variables: {},
  },
  result: {
    data: {
      transfers: [],
      dfsps: [],
      transferSummary: [
        {
          count: 3,
          payeeDFSP: 'noresponsepayeefsp',
        },
        {
          count: 24,
          payeeDFSP: 'payeefsp',
        },
        {
          count: 6,
          payeeDFSP: 'payerfsp',
        },
        {
          count: 4,
          payeeDFSP: 'testfsp1',
        },
        {
          count: 8,
          payeeDFSP: 'testfsp2',
        },
      ],
    },
  },
};

export const transferSummaryErrorsByCurrencyQueryMock: MockedResponse<Query> = {
  request: {
    query: GET_TRANSFER_SUMMARY_ERRORS_BY_CURRENCY,
    variables: {},
  },
  result: {
    data: {
      transfers: [],
      dfsps: [],
      transferSummary: [
        {
          count: 44,
          errorCode: null,
        },
        {
          count: 1,
          errorCode: 3100,
        },
      ],
    },
  },
};

export const transferSummaryErrorsByPayerDFSPQueryMock: MockedResponse<Query> = {
  request: {
    query: GET_TRANSFER_SUMMARY_ERRORS_BY_PAYER_DFSP,
    variables: {},
  },
  result: {
    data: {
      transfers: [],
      dfsps: [],
      transferSummary: [
        {
          count: 6,
          errorCode: null,
          payerDFSP: 'payeefsp',
        },
        {
          count: 4,
          errorCode: null,
          payerDFSP: 'payerfsp',
        },
        {
          count: 8,
          errorCode: null,
          payerDFSP: 'testfsp1',
        },
        {
          count: 4,
          errorCode: null,
          payerDFSP: 'testfsp2',
        },
        {
          count: 22,
          errorCode: null,
          payerDFSP: 'testingtoolkitdfsp',
        },
        {
          count: 1,
          errorCode: 3100,
          payerDFSP: 'testingtoolkitdfsp',
        },
      ],
    },
  },
};

export const transferSummaryErrorsByPayeeDFSPQueryMock: MockedResponse<Query> = {
  request: {
    query: GET_TRANSFER_SUMMARY_ERRORS_BY_PAYEE_DFSP,
    variables: {},
  },
  result: {
    data: {
      transfers: [],
      dfsps: [],
      transferSummary: [
        {
          count: 2,
          errorCode: null,
          payeeDFSP: 'noresponsepayeefsp',
        },
        {
          count: 1,
          errorCode: 3100,
          payeeDFSP: 'noresponsepayeefsp',
        },
        {
          count: 24,
          errorCode: null,
          payeeDFSP: 'payeefsp',
        },
        {
          count: 6,
          errorCode: null,
          payeeDFSP: 'payerfsp',
        },
        {
          count: 4,
          errorCode: null,
          payeeDFSP: 'testfsp1',
        },
        {
          count: 8,
          errorCode: null,
          payeeDFSP: 'testfsp2',
        },
      ],
    },
  },
};

export const transferSummary: MockedResponse<Query> = {
  request: {
    query: GET_TRANSFER_SUMMARY,
    variables: {},
  },
  result: {
    data: {
      transfers: [],
      dfsps: [],
      transferSummary: [
        {
          count: 44,
          errorCode: null,
        },
        {
          count: 1,
          errorCode: 3100,
        },
      ],
    },
  },
};
