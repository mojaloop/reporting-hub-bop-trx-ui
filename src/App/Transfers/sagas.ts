import api from 'utils/api';
import { PayloadAction } from '@reduxjs/toolkit';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { REQUEST_TRANSFERS, SELECT_TRANSFER, Transfer, TransferParty } from './types';

import { setTransfers, setTransfersError, setTransferDetails } from './actions';

import { getTransfersFilter } from './selectors';

function* fetchTransfers() {
  try {
    // @ts-ignore
    const filters = yield select(getTransfersFilter);
    // @ts-ignore
    const response = yield call(api.transfers.read, filters);

    if (response.status !== 200) {
      throw new Error(response.data);
    }

    // project result into our Transfer type
    const res: Transfer[] = response.data.map(
      (t: any) =>
        ({
          id: t.transferId,
          quoteTimestamp: t.quoteTimestamp,
          transferTimestamp: t.transferTimestamp,
          payerFspid: t.payerFspid,
          payeeFspid: t.payeeFspid,
          type: t.transactionType,
          currency: t.currency,
          amount: t.amount,
          payerParty: {
            type: 'payer',
            idType: t.payerIdType,
            idValue: t.payerIdValue,
          } as TransferParty,
          payeeParty: {
            type: 'payee',
            idType: t.payeeIdType,
            idValue: t.payeeIdValue,
          } as TransferParty,
          status: t.state,
        } as Transfer),
    );

    yield put(setTransfers(res));
  } catch (e) {
    yield put(setTransfersError(e.message));
  }
}

function* fetchTransferDetails(action: PayloadAction<Transfer>) {
  try {
    // @ts-ignore
    const response = yield call(api.transferDetails.read, action.payload.id);

    if (response.status !== 200) {
      throw new Error(response.data);
    }

    yield put(setTransferDetails(response.data));
  } catch (e) {
    yield put(setTransfersError(e.message));
  }
}

export function* FetchTransferDetailsSaga(): Generator {
  yield takeLatest(SELECT_TRANSFER, fetchTransferDetails);
}

export function* FetchTransfersSaga(): Generator {
  yield takeLatest(REQUEST_TRANSFERS, fetchTransfers);
}

export default function* rootSaga(): Generator {
  yield all([FetchTransfersSaga(), FetchTransferDetailsSaga()]);
}
