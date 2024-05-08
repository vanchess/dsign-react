import { combineReducers } from 'redux';
import { messageInReducer }  from './messageInReducer';


export const displistReducer = combineReducers({
  displist: messageInReducer,
});