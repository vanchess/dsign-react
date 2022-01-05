import { combineReducers } from 'redux';
import { messageInReducer }  from './messageInReducer';
import { contractPaymentOmsReducer }  from './contractPaymentOmsReducer';

export const agreementReducer = combineReducers({
  incoming: messageInReducer,
  contractPaymentOms: contractPaymentOmsReducer
});