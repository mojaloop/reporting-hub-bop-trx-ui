import { all } from 'redux-saga/effects';
import transfersSagas from './Transfers/sagas';

function* rootSaga(): Generator {
  yield all([transfersSagas()]);
}

export default rootSaga;
