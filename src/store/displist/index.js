import { combineReducers } from 'redux';
import { messageInReducer }  from './messageInReducer';
import { displistEntriesReducer } from './displistEntryStore';
import { preventiveMedicalMeasureReducer } from './preventiveMedicalMeasureStore';


export const displistReducer = combineReducers({
  displistMsg: messageInReducer,
  displistEntry: displistEntriesReducer,
  preventiveMedicalMeasureTypes: preventiveMedicalMeasureReducer
});