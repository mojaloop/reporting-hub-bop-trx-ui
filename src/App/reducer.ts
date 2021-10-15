import { combineReducers } from 'redux';
import { reducer as config } from './Config';
import { reducer as transfersReducer } from './Transfers/slice';

export const reducers = {
  config,
  transfers: transfersReducer,
};

export default combineReducers(reducers);
