import { combineReducers } from 'redux';

//import { authentication } from './authentication.reducer';
import { messageInPaginationReducer }  from './messageInPaginationReducer';
import { messageOutPaginationReducer } from './messageOutPaginationReducer';
import { meeMessageInPaginationReducer }  from './meeMessageInPaginationReducer';
//import { alert } from './alert.reducer';

export const expertisePaginationReducer = combineReducers({
  incoming: messageInPaginationReducer,
  outgoing: messageOutPaginationReducer,
  mee: meeMessageInPaginationReducer
});