import { combineReducers } from 'redux';

//import { authentication } from './authentication.reducer';
import { medicalInstitutionPaginationReducer } from './medical-institution/medicalInstitutionPaginationReducer';
import { myFilePaginationReducer } from './my-file/myFilePaginationReducer';
import { messagePaginationReducer } from './message';
import { billPaginationReducer } from './bill';
import { expertisePaginationReducer } from './expertise';
//import { alert } from './alert.reducer';

export const paginationReducer = combineReducers({
  medicalInstitution: medicalInstitutionPaginationReducer,
  myFile: myFilePaginationReducer,
  message: messagePaginationReducer,
  bill: billPaginationReducer,
  expertise: expertisePaginationReducer
});