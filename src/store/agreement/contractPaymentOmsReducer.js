import { CONTRACT_PAYMENT_OMS_MESSAGE_IN_GET_REQUEST, CONTRACT_PAYMENT_OMS_MESSAGE_IN_GET_SUCCESS, CONTRACT_PAYMENT_OMS_MESSAGE_IN_GET_FAILURE } from '../../constants/agreementConstants.js'

const initialState = {
  items: [],
  loading: false,
  error: false,
};

export function contractPaymentOmsReducer(state = initialState, action) {
  switch (action.type) {
    case CONTRACT_PAYMENT_OMS_MESSAGE_IN_GET_REQUEST:
      return { ...state,
        loading: true
      };
    case CONTRACT_PAYMENT_OMS_MESSAGE_IN_GET_SUCCESS:  
      return { ...state,
        items: action.items,
        loading: false
      };
    case CONTRACT_PAYMENT_OMS_MESSAGE_IN_GET_FAILURE:
      return { ...state,
        error: action.error,
        loading: false
      };
    default:
      return state
  }
}