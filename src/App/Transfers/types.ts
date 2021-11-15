import { Party, Transfer } from 'apollo/types';

export interface TransfersFilter {
  transferId: string | undefined;
  payerFSPId: string | undefined;
  payeeFSPId: string | undefined;
  payerIdType: string | undefined;
  payerIdValue: string | undefined;
  payeeIdType: string | undefined;
  payeeIdValue: string | undefined;
  from: string | undefined;
  to: string | undefined;
  currency: string | undefined;
  transferState: string | undefined;
  timeframeSelect: string;
}

export type FilterChangeValue = string | undefined;
export interface ExtensionListItem {
  key: string;
  value: string;
}

export enum PartyType {
  PAYER = 'Payer',
  PAYEE = 'Payee',
}

export enum DateRanges {
  PastTwentyFour = 'Past 24 Hours',
  Today = 'Today',
  PastFortyEight = 'Past 48 Hours',
  OneWeek = '1 Week',
  OneMonth = '1 Month',
  OneYear = '1 Year',
  Custom = 'Custom Range',
}

export interface PartyModalData {
  type: PartyType;
  party: Party;
}

export interface JsonModalData {
  title: string;
  json: object;
}

export interface MojaloopError {
  errorInformation: MojaloopErrorInformation;
}

export interface MojaloopErrorInformation {
  errorCode: string;
  errorDescription: string;
  extensionList?: ExtensionListItem[];
}

export interface TransfersState {
  selectedTransfer: Transfer | undefined;
  transfersFilter: TransfersFilter;
  selectedJson: JsonModalData | undefined;
  selectedParty: PartyModalData | undefined;
}
