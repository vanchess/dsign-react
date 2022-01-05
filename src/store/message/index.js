import { combineReducers } from 'redux';

//import { authentication } from './authentication.reducer';
import { messageInReducer }  from './messageInReducer';
import { messageOutReducer } from './messageOutReducer';
//import { alert } from './alert.reducer';

export const messageReducer = combineReducers({
  incoming: messageInReducer,
  outgoing: messageOutReducer
});