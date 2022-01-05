import { combineReducers } from 'redux';

//import { authentication } from './authentication.reducer';
import { messageInReducer }  from './messageInReducer';
import { rejectedInReducer } from './rejectedInReducer';

export const registerReducer = combineReducers({
  incoming: messageInReducer,
  rejectedIn: rejectedInReducer,
});