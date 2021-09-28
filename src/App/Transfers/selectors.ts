import { State } from 'store/types';

export const getSelectedTransfer = (state: State) => state.transfers.selectedTransfer;
export const getTransfers = (state: State) => state.transfers.transfers;
export const getTransfersError = (state: State) => state.transfers.transfersError;
export const getIsTransfersPending = (state: State) => state.transfers.isTransfersPending;
export const getTransfersFilter = (state: State) => state.transfers.transfersFilter;
