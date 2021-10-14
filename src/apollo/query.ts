/* eslint-disable prettier/prettier */
import { gql } from '@apollo/client';

export const GET_TRANSFERS = gql`
  query GetTransfersWithEvents(
    $transferId: String!
    $payeeDFSPId: String!
    $payerDFSPId: String!
    $startDate: String!
    $endDate: String!
    $currency: String!
    $transferState: String!
  ) {
    transfers(
      filter: {
        transferId: $transferId
        startDate: $startDate
        endDate: $endDate
        currency: $currency
        transferState: $transferState
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
    }
  }
`;
