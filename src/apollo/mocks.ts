import * as Factory from 'factory.ts';
import faker from 'faker';
import { MockedResponse } from '@apollo/client/testing';
import { GET_TRANSFERS_WITH_EVENTS } from './query';
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
  },
  result: {
    data: {
      transfers: TransferMock.buildList(100),
      dfsps: [],
      transferSummary: [],
    },
  },
};
