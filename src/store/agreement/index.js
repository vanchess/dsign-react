import { combineReducers } from 'redux';
import { messageInReducer }  from './messageInReducer';
import { contractPaymentOmsReducer }  from './contractPaymentOmsReducer';
import { contractFinancialSupportOmsReducer }  from './contractFinancialSupportOmsReducer';
import { agreementFinSalariesReducer }  from './agreementFinSalariesReducer';


export const agreementReducer = combineReducers({
  incoming: messageInReducer,
  contractPaymentOms: contractPaymentOmsReducer,
  contractFinancialSupportOms: contractFinancialSupportOmsReducer,
  agreementFinSalaries: agreementFinSalariesReducer
});