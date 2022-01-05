import { combineReducers } from 'redux';

//import { authentication } from './authentication.reducer';
import { messageInReducer }  from './messageInReducer';
import { messageOutReducer } from './messageOutReducer';
import { rejectedInReducer } from './rejectedInReducer';
import { rejectedOutReducer } from './rejectedOutReducer';
import { reconciliationActReducer } from './reconciliationActReducer';

export const billReducer = combineReducers({
  incoming: messageInReducer,
  outgoing: messageOutReducer,
  rejectedIn: rejectedInReducer,
  rejectedOut: rejectedOutReducer,
  reconciliationAct: reconciliationActReducer
});