import { combineReducers } from 'redux';

//import { authentication } from './authentication.reducer';
import { medicalInstitutionReducer } from './medical-institution/medicalInstitutionReducer';
import { myFileReducer }       from './my-file/myFileReducer';
import { userReducer }         from './user/userReducer';
import { paginationReducer }   from './pagination';
import { filtersReducer }      from './filters';
import { messageReducer }      from './message';
import { expertiseReducer }    from './expertise';
import { billReducer }         from './bill';
import { registerReducer }     from './register';
import { agreementReducer }    from './agreement';
import { cadespluginReducer }  from './cadesplugin/cadespluginReducer';
import { organizationReducer } from './organization/organizationReducer';
import { messageStatusReducer } from './messageStatus/messageStatusReducer';
import { periodReducer }       from './period/periodReducer';
import { authReducer }         from './auth/authReducer';
import { displistReducer }     from './displist'
import { dnReducer } from './dn';
//import { alert } from './alert.reducer';

const rootReducer = combineReducers({
  medicalInstitutionReducer,
  myFileReducer,
  userReducer,
  paginationReducer,
  filtersReducer,
  cadespluginReducer,
  messageReducer,
  billReducer,
  registerReducer,
  agreementReducer,
  expertiseReducer,
  organizationReducer,
  messageStatusReducer,
  periodReducer,
  authReducer,
  displist: displistReducer,
  dn: dnReducer
});

export default rootReducer;