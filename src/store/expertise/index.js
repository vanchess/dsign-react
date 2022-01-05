import { combineReducers } from 'redux';

//import { authentication } from './authentication.reducer';
import { messageInReducer }  from './messageInReducer';
import { messageOutReducer } from './messageOutReducer';
import { meeMessageInReducer }  from './meeMessageInReducer';
//import { alert } from './alert.reducer';

export const expertiseReducer = combineReducers({
  incoming: messageInReducer,
  outgoing: messageOutReducer,
  mee: meeMessageInReducer
});