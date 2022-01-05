import { combineReducers } from 'redux';

//import { authentication } from './authentication.reducer';
import { billFiltersReducer } from './bill/billFiltersReducer';


export const filtersReducer = combineReducers({
  bill: billFiltersReducer,
});