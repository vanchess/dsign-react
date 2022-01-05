import { MEDICAL_INSTITUTION_GET_SUCCESS } from '../../../constants/medicalInstitutionConstants.js'
import { MEDICAL_INSTITUTION_CHANGE_PER_PAGE, MEDICAL_INSTITUTION_CHANGE_PAGE } from '../../../constants/medicalInstitutionPaginationConstants'

const initialState = {
    page: 0, 
    perPage: 15,
    medicalInstitutionTotal: 0
};

export function medicalInstitutionPaginationReducer(state = initialState, action) {
  switch (action.type) {
    case MEDICAL_INSTITUTION_GET_SUCCESS:
      return { ...state,
        medicalInstitutionTotal: action.medicalInstitutionTotal
      };
    case MEDICAL_INSTITUTION_CHANGE_PER_PAGE:
      return { ...state,
        perPage: action.perPage,
        page: 0,
      };
    case MEDICAL_INSTITUTION_CHANGE_PAGE:
      return { ...state,
        page: action.page,
       };
    default:
      return state
  }
}