import { combineReducers } from 'redux';

//import { authentication } from './authentication.reducer';
import { messageInPaginationReducer }  from './messageInPaginationReducer';
import { messageOutPaginationReducer } from './messageOutPaginationReducer';
//import { alert } from './alert.reducer';

export const messagePaginationReducer = combineReducers({
  incoming: messageInPaginationReducer,
  outgoing: messageOutPaginationReducer
});