/* eslint-disable prettier/prettier */
import { gql } from '@apollo/client';

export const GET_TRANSFERS_WITH_EVENTS = gql`
  query GetTransfersWithEvents(
    $startDate: String!
    $endDate: String!
    $currency: String!
    $transferState: String!
    $payeeFSPId: String!
    $payerFSPId: String!
    $payeeIdType: String!
    $payerIdType: String!
    $payeeIdValue: String!
    $payerIdValue: String!
  ) {
    transfers(
      filter: {
        startDate: $startDate
        endDate: $endDate
        currency: $currency
        transferState: $transferState
        payer: { dfsp: $payerFSPId, idType: $payerIdType, idValue: $payerIdValue }
        payee: { dfsp: $payeeFSPId, idType: $payeeIdType, idValue: $payeeIdValue }
      }
    ) {
      transferId
      transferState
      transactionType
      currency
      amount
      payeeDFSP
      payerDFSP
      settlementId
      createdAt
      quoteId
      payerParty
      payeeParty
      partyLookupEvents
      quoteEvents
      transferEvents
      settlementEvents
    }
  }
`;
