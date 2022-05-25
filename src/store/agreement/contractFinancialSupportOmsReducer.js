import { CONTRACT_FINANCIAL_SUPPORT_OMS_MESSAGE_IN_GET_REQUEST, CONTRACT_FINANCIAL_SUPPORT_OMS_MESSAGE_IN_GET_SUCCESS, CONTRACT_FINANCIAL_SUPPORT_OMS_MESSAGE_IN_GET_FAILURE } from '../../constants/agreementConstants.js'

const initialState = {
  items: [],
  loading: false,
  error: false,
};

export function contractFinancialSupportOmsReducer(state = initialState, action) {
  switch (action.type) {
    case CONTRACT_FINANCIAL_SUPPORT_OMS_MESSAGE_IN_GET_REQUEST:
      return { ...state,
        loading: true
      };
    case CONTRACT_FINANCIAL_SUPPORT_OMS_MESSAGE_IN_GET_SUCCESS:  
      return { ...state,
        items: action.items,
        loading: false
      };
    case CONTRACT_FINANCIAL_SUPPORT_OMS_MESSAGE_IN_GET_FAILURE:
      return { ...state,
        error: action.error,
        loading: false
      };
    default:
      return state
  }
}