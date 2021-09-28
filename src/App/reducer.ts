import { combineReducers } from 'redux';
import { reducer as config } from './Config';
import transfersReducer from './Transfers/reducer';

export const reducers = {
  config,
  transfers: transfersReducer,
};

export default combineReducers(reducers);
