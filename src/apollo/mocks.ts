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
  Party,
  PartyIdType,
  TransactionType,
  TransferState,
  TransferSummary,
  TransferTerms,
  Conversions,
  ConversionTerms,
  PositionChange,
  QuoteRequest,
  ConversionStateChanges,
} from './types';

export const PartyMock = Factory.Sync.makeFactory<Party>({
  __typename: 'Party',
  partyIdentifier: Factory.each(() => faker.datatype.number()),
  partyName: Factory.each(() => faker.name.firstName()),
  dateOfBirth: Factory.each(() => faker.datatype.datetime().toJSON()),
  partyIdType: Factory.each(() =>
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
  supportedCurrencies: Factory.each(() =>
    faker.random.arrayElement(['USD', 'EUR', 'CNY', 'MMK', 'TZS']),
  ),
});

export const PositionChangesMock = Factory.Sync.makeFactory<PositionChange>({
  id: Factory.each(() => faker.datatype.number()),
  participantName: Factory.each(() => faker.datatype.string()),
  currency: Factory.each(() => faker.datatype.string()),
  ledgerType: Factory.each(() => faker.datatype.string()),
  dateTime: Factory.each(() => faker.datatype.datetime().toJSON()),
  updatedPosition: Factory.each(() => faker.datatype.string()),
  change: Factory.each(() => faker.datatype.string()),
});

export const QuoteRequestMock = Factory.Sync.makeFactory<QuoteRequest>({
  quoteId: Factory.each(() => faker.datatype.number()),
  amountType: Factory.each(() => faker.datatype.string()),
  amount: Factory.each(() => ({ amount: faker.datatype.number(), currency: 'USD' })),
  fees: Factory.each(() => ({ amount: faker.datatype.number(), currency: 'USD' })),
});

export const TransferTermsMock = Factory.Sync.makeFactory<TransferTerms>({
  transferAmount: Factory.each(() => ({ amount: faker.datatype.number(), currency: 'USD' })),
  payeeFspCommission: Factory.each(() => ({ amount: faker.datatype.number(), currency: 'USD' })),
  payeeReceiveAmount: Factory.each(() => ({ amount: faker.datatype.number(), currency: 'USD' })),
  payeeFspFee: Factory.each(() => ({ amount: faker.datatype.number(), currency: 'USD' })),
  expiration: Factory.each(() => faker.datatype.datetime().toJSON()),
  geoCode: Factory.each(() => ({
    latitude: faker.address.latitude(),
    longitude: faker.address.longitude(),
  })),
  ilpPacket: Factory.each(() => faker.random.arrayElement(['USD', 'EUR'])),
});

export const ConversionStateChangesMock = Factory.Sync.makeFactory<ConversionStateChanges>({
  conversionState: Factory.each(() => faker.datatype.string()),
  date: Factory.each(() => faker.datatype.datetime().toJSON()),
  reason: Factory.each(() => faker.datatype.string()),
});

export const ConversionTermsMock = Factory.Sync.makeFactory<ConversionTerms>({
  conversionId: Factory.each(() => faker.datatype.uuid()),
  determiningTransferId: Factory.each(() => faker.datatype.uuid()),
  initiatingFsp: Factory.each(() => faker.company.companyName()),
  counterPartyFsp: Factory.each(() => faker.datatype.string()),
  amountType: Factory.each(() => faker.random.arrayElement(['fixed', 'variable'])),
  sourceAmount: Factory.each(() => ({ amount: faker.datatype.number(), currency: 'USD' })),
  targetAmount: Factory.each(() => ({ amount: faker.datatype.number(), currency: 'USD' })),
  expiration: Factory.each(() => faker.datatype.datetime().toJSON()),
  charges: Factory.each(() => [
    {
      chargeType: faker.random.arrayElement(['fee', 'commission']),
      sourceAmount: { amount: faker.datatype.number(), currency: 'USD' },
      targetAmount: { amount: faker.datatype.number(), currency: 'USD' },
    },
  ]),
  ilpPacket: Factory.each(() => faker.datatype.string()),
});

export const ConversionsMock = Factory.Sync.makeFactory<Conversions>({
  payer: Factory.each(() => ({
    conversionRequestId: faker.datatype.string(),
    conversionId: faker.datatype.uuid(),
    conversionCommitRequestId: faker.datatype.uuid(),
    conversionState: faker.random.arrayElement(['pending', 'completed', 'failed']),
    conversionStateChanges: ConversionStateChangesMock.build(),
    counterPartyFSP: faker.datatype.string(),
    conversionType: faker.random.arrayElement(['type1', 'type2']),
    createdAt: faker.datatype.datetime().toJSON(),
    conversionSettlementWindowId: faker.datatype.number(),
    counterPartyProxy: faker.datatype.string(),
    conversionTerms: ConversionTermsMock.build(),
  })),
  payee: Factory.each(() => ({
    conversionRequestId: faker.datatype.string(),
    conversionId: faker.datatype.uuid(),
    conversionCommitRequestId: faker.datatype.uuid(),
    conversionState: faker.random.arrayElement(['pending', 'completed', 'failed']),
    conversionStateChanges: ConversionStateChangesMock.build(),
    counterPartyFSP: faker.datatype.string(),
    conversionType: faker.random.arrayElement(['type1', 'type2']),
    createdAt: faker.datatype.datetime().toJSON(),
    conversionSettlementWindowId: faker.datatype.number(),
    counterPartyProxy: faker.datatype.string(),
    conversionTerms: ConversionTermsMock.build(),
  })),
});

export const TransferMock = Factory.Sync.makeFactory<Transfer>({
  __typename: 'Transfer',
  transferId: Factory.each(() => faker.datatype.uuid()),
  transactionId: Factory.each(() => faker.datatype.uuid()),
  sourceAmount: Factory.each(() => faker.datatype.float()),
  targetAmount: Factory.each(() => faker.datatype.float()),
  sourceCurrency: Factory.each(() =>
    faker.random.arrayElement(['USD', 'EUR', 'CNY', 'MMK', 'TZS']),
  ),
  targetCurrency: Factory.each(() =>
    faker.random.arrayElement(['USD', 'EUR', 'CNY', 'MMK', 'TZS']),
  ),
  createdAt: Factory.each(() => faker.datatype.datetime().toJSON()),
  lastUpdated: Factory.each(() => faker.datatype.datetime().toJSON()),
  baseUseCase: Factory.each(() => faker.datatype.string()),
  transferState: Factory.each(() =>
    faker.random.arrayElement([
      TransferState.Aborted,
      TransferState.Committed,
      TransferState.Reserved,
      TransferState.Settled,
    ]),
  ),
  transferStateChanges: Factory.each(() => faker.datatype.string()),
  transactionType: Factory.each(() =>
    faker.random.arrayElement([
      TransactionType.Transfer,
      TransactionType.Deposit,
      TransactionType.Withdrawal,
      TransactionType.Payment,
      TransactionType.Refund,
    ]),
  ),
  errorCode: Factory.each(() => faker.datatype.string()),
  settlementWindowId: Factory.each(() => faker.datatype.number()),
  transferSettlementBatchId: Factory.each(() => faker.datatype.number()),
  conversionSettlementBatchId: Factory.each(() => faker.datatype.number()),
  payerDFSP: Factory.each(() => faker.datatype.string()),
  payerDFSPProxy: Factory.each(() => faker.datatype.string()),
  payeeDFSP: Factory.each(() => faker.datatype.string()),
  payeeDFSPProxy: Factory.each(() => faker.datatype.string()),
  positionChanges: Factory.each(() => PositionChangesMock.build()),
  payerParty: Factory.each(() => PartyMock.build()),
  payeeParty: Factory.each(() => PartyMock.build()),
  quoteRequest: Factory.each(() => QuoteRequestMock.build()),
  transferTerms: Factory.each(() => TransferTermsMock.build()),
  conversions: Factory.each(() => ConversionsMock.build()),
  partyLookupEvents: Factory.each(() => {
    return JSON.parse(faker.datatype.json());
  }),
  quoteEvents: Factory.each(() => {
    return JSON.parse(JSON.stringify({ data: faker.datatype.string(1000) }));
  }),
  transferEvents: Factory.each(() => {
    return JSON.parse(faker.datatype.json());
  }),
  settlementEvents: Factory.each(() => {
    return JSON.parse(faker.datatype.json());
  }),
  transferSettlementWindowId: Factory.each(() => faker.datatype.number()),
  quoteRequestId: Factory.each(() => faker.datatype.number()),
  transferTermsId: Factory.each(() => faker.datatype.number()),
  fxQuoteEvents: Factory.each(() => {
    return JSON.parse(faker.datatype.json());
  }),
  fxTransferEvents: Factory.each(() => {
    return JSON.parse(faker.datatype.json());
  }),
  fxSettlementEvents: Factory.each(() => {
    return JSON.parse(faker.datatype.json());
  }),
  id: 0,
});

export const TransferSummaryMock = Factory.Sync.makeFactory<TransferSummary>({
  __typename: 'TransferSummary',
  count: Factory.each(() => faker.datatype.number()),
  payerDFSP: Factory.each(() => faker.company.companyName()),
  payeeDFSP: Factory.each(() => faker.company.companyName()),
  sourceCurrency: Factory.each(() =>
    faker.random.arrayElement(['USD', 'EUR', 'CNY', 'MMK', 'TZS']),
  ),
  targetCurrency: Factory.each(() =>
    faker.random.arrayElement(['USD', 'EUR', 'CNY', 'MMK', 'TZS']),
  ),
  errorCode: Factory.each(() => faker.datatype.number()),
  id: 0,
});

export const TransferSummaryMockByErrorCode = Factory.Sync.makeFactory<TransferSummary>({
  __typename: 'TransferSummary',
  count: Factory.each(() => faker.datatype.number()),
  errorCode: Factory.each(() => faker.datatype.number()),
  id: 0,
});

export const TransferSummaryMockByCurrency = Factory.Sync.makeFactory<TransferSummary>({
  __typename: 'TransferSummary',
  count: Factory.each(() => faker.datatype.number()),
  sourceCurrency: Factory.each(() => faker.datatype.string(3)),
  targetCurrency: Factory.each(() => faker.datatype.string(3)),
  errorCode: Factory.each(() => faker.datatype.number()),
  id: 0,
});

export const TransferSummaryMockByPayeeDFSP = Factory.Sync.makeFactory<TransferSummary>({
  __typename: 'TransferSummary',
  count: Factory.each(() => faker.datatype.number()),
  payeeDFSP: Factory.each(() => faker.company.companyName()),
  errorCode: Factory.each(() => faker.datatype.number()),
  id: 0,
});

export const TransferSummaryMockByPayerDFSP = Factory.Sync.makeFactory<TransferSummary>({
  __typename: 'TransferSummary',
  count: Factory.each(() => faker.datatype.number()),
  payerDFSP: Factory.each(() => faker.company.companyName()),
  errorCode: Factory.each(() => faker.datatype.number()),
  id: 0,
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
          sourceCurrency: 'USD',
          targetCurrency: 'USD',
          errorCode: null,
        },
        {
          count: 2000000,
          sourceCurrency: 'EUR',
          targetCurrency: 'EUR',
          errorCode: null,
        },
        {
          count: 40000,
          sourceCurrency: 'USD',
          targetCurrency: 'USD',
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
