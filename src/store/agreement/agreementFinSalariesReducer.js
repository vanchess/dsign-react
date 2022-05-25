import { AGREEMENT_FIN_SALARIES_MESSAGE_IN_GET_REQUEST, AGREEMENT_FIN_SALARIES_MESSAGE_IN_GET_SUCCESS, AGREEMENT_FIN_SALARIES_MESSAGE_IN_GET_FAILURE } from '../../constants/agreementConstants.js'
const initialState = {
  items: [],
  loading: false,
  error: false,
};

export function agreementFinSalariesReducer(state = initialState, action) {
  switch (action.type) {
    case AGREEMENT_FIN_SALARIES_MESSAGE_IN_GET_REQUEST:
      return { ...state,
        loading: true
      };
    case AGREEMENT_FIN_SALARIES_MESSAGE_IN_GET_SUCCESS:  
      return { ...state,
        items: action.items,
        loading: false
      };
    case AGREEMENT_FIN_SALARIES_MESSAGE_IN_GET_FAILURE:
      return { ...state,
        error: action.error,
        loading: false
      };
    default:
      return state
  }
}