import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Transfer } from 'apollo/types';
import * as types from './types';

const initialState: types.TransfersState = {
  selectedTransfer: undefined,
  selectedJson: undefined,
  selectedParty: undefined,
  transfersFilter: {
    payerFspid: undefined,
    payeeFspid: undefined,
    payerIdType: undefined,
    payerIdValue: undefined,
    payeeIdType: undefined,
    payeeIdValue: undefined,
    from: undefined,
    to: undefined,
    currency: undefined,
    transferState: undefined,
  },
};

const slice = createSlice({
  name: 'Sagas',
  initialState,
  reducers: {
    selectTransfer(state: types.TransfersState, action: PayloadAction<Transfer>) {
      return {
        ...state,
        selectedTransfer: action.payload,
      };
    },
    transferDetailsModalClose(state: types.TransfersState) {
      return {
        ...state,
        selectedTransfer: initialState.selectedTransfer,
      };
    },
    setJsonModalData(state: types.TransfersState, action: PayloadAction<types.JsonModalData>) {
      return {
        ...state,
        selectedJson: action.payload,
      };
    },
    jsonModalClose(state: types.TransfersState) {
      return {
        ...state,
        selectedJson: initialState.selectedJson,
      };
    },
    setPartyModalData(state: types.TransfersState, action: PayloadAction<types.PartyModalData>) {
      return {
        ...state,
        selectedParty: action.payload,
      };
    },
    partyModalClose(state: types.TransfersState) {
      return {
        ...state,
        selectedParty: initialState.selectedParty,
      };
    },
    setTransferFinderFilter(
      state: types.TransfersState,
      action: PayloadAction<{ field: string; value: types.FilterChangeValue }>,
    ) {
      const { field, value } = action.payload;

      return {
        ...state,
        transfersFilter: {
          ...state.transfersFilter,
          [field]: value,
        },
      };
    },
    clearTransferFinderFilters(state: types.TransfersState) {
      return {
        ...state,
        transfersFilter: initialState.transfersFilter,
      };
    },
  },
});

export const { reducer, actions } = slice;
export default reducer;
