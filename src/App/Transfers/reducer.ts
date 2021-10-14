import { createReducer, PayloadAction } from '@reduxjs/toolkit';
import * as types from './types';
import * as actions from './actions';
import { Transfer } from '../../apollo/types';

const initialState: types.TransfersState = {
  selectedTransfer: undefined,
  transfersFilter: {
    transferId: undefined,
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

export default createReducer(initialState, (builder) =>
  builder
    .addCase(
      actions.setTransferFinderFilter,
      (
        state: types.TransfersState,
        action: PayloadAction<{ field: string; value: types.FilterChangeValue }>,
      ) => {
        const { field, value } = action.payload;

        return {
          ...state,
          transfersFilter: {
            ...state.transfersFilter,
            [field]: value,
          },
        };
      },
    )
    .addCase(actions.clearTransferFinderFilters, (state: types.TransfersState) => ({
      ...state,
      transfersFilter: initialState.transfersFilter,
    }))
    .addCase(
      actions.selectTransfer,
      (state: types.TransfersState, action: PayloadAction<Transfer>) => ({
        ...state,
        selectedTransfer: action.payload,
      }),
    )
    .addCase(actions.transferDetailsModalClose, (state: types.TransfersState) => ({
      ...state,
      selectedTransfer: initialState.selectedTransfer,
    })),
);
