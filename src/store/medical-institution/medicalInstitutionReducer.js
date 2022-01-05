import { MEDICAL_INSTITUTION_GET_REQUEST, MEDICAL_INSTITUTION_GET_SUCCESS, MEDICAL_INSTITUTION_GET_FAILURE } from '../../constants/medicalInstitutionConstants.js'

const initialState = {
  medicalInstitutions: [],
  loading: false,
  error: false,
};

export function medicalInstitutionReducer(state = initialState, action) {
  switch (action.type) {
    case MEDICAL_INSTITUTION_GET_REQUEST:
      return { ...state,
        loading: true
      };
    case MEDICAL_INSTITUTION_GET_SUCCESS:  
      return { ...state,
        medicalInstitutions: action.medicalInstitutions,
        loading: false
      };
    case MEDICAL_INSTITUTION_GET_FAILURE:
      return { ...state,
        error: action.error,
        loading: false
      };
    default:
      return state
  }
}