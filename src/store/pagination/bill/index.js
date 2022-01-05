import { combineReducers } from 'redux';

//import { authentication } from './authentication.reducer';
import { messageInPaginationReducer }  from './messageInPaginationReducer';
import { messageOutPaginationReducer } from './messageOutPaginationReducer';
import { rejectedInPaginationReducer }  from './rejectedInPaginationReducer';
import { rejectedOutPaginationReducer }  from './rejectedOutPaginationReducer';
import { reconciliationActPaginationReducer } from './reconciliationActPaginationReducer'
//import { alert } from './alert.reducer';

export const billPaginationReducer = combineReducers({
  incoming: messageInPaginationReducer,
  outgoing: messageOutPaginationReducer,
  rejectedIn: rejectedInPaginationReducer,
  rejectedOut: rejectedOutPaginationReducer,
  reconciliationAct: reconciliationActPaginationReducer
});