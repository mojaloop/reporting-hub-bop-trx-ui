import { Transfer } from 'apollo/types';

export interface TransfersFilter {
  transferId: string | undefined;
  payerFspid: string | undefined;
  payeeFspid: string | undefined;
  payerIdType: string | undefined;
  payerIdValue: string | undefined;
  payeeIdType: string | undefined;
  payeeIdValue: string | undefined;
  from: string | undefined;
  to: string | undefined;
  currency: string | undefined;
  transferState: string | undefined;
}

export type FilterChangeValue = string | undefined;
export interface ExtensionListItem {
  key: string;
  value: string;
}

export interface TransferParty {
  type: string;
  idType: string;
  idValue: string;
  idSubValue?: string;
  displayName?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  dateOfBirth?: string;
  merchantClassificationCode?: string;
  fspId: string;
  extensionList?: ExtensionListItem[];
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
  selectedJson: Object | undefined;
}
