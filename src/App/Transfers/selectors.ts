import { State } from 'store/types';

export const getSelectedTransfer = (state: State) => state.transfers.selectedTransfer;
export const getTransfersFilter = (state: State) => state.transfers.transfersFilter;
