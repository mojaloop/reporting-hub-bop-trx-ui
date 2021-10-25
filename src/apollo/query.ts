/* eslint-disable prettier/prettier */
import { gql } from '@apollo/client';

export const GET_TRANSFERS_WITH_EVENTS = gql`
  query GetTransfersWithEvents(
    $startDate: DateTimeFlexible!
    $endDate: DateTimeFlexible!
    $currency: Currency
    $transferState: TransferState
    $payeeFSPId: String
    $payerFSPId: String
    $payeeIdType: PartyIDType
    $payerIdType: PartyIDType
    $payeeIdValue: String
    $payerIdValue: String
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
      payeeDFSP {
        id
        name
        description
      }
      payerDFSP {
        id
        name
        description
      }
      settlementId
      createdAt
      quoteId
      payerParty {
        id
        firstName
        lastName
        middleName
        dateOfBirth
        idType
        idValue
      }
      payeeParty {
        id
        firstName
        lastName
        middleName
        dateOfBirth
        idType
        idValue
      }
      #partyLookupEvents
      #quoteEvents
      #transferEvents
      #settlementEvents
    }
  }
`;
