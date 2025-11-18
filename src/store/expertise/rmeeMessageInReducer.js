import { R_MEE_MESSAGE_IN_GET_REQUEST, R_MEE_MESSAGE_IN_GET_SUCCESS, R_MEE_MESSAGE_IN_GET_FAILURE } from '../../constants/expertiseConstants.js'

const initialState = {
  items: [],
  loading: false,
  error: false,
};

export function rmeeMessageInReducer(state = initialState, action) {
  switch (action.type) {
    case R_MEE_MESSAGE_IN_GET_REQUEST:
      return { ...state,
        loading: true
      };
    case R_MEE_MESSAGE_IN_GET_SUCCESS:  
      return { ...state,
        items: action.items,
        loading: false
      };
    case R_MEE_MESSAGE_IN_GET_FAILURE:
      return { ...state,
        error: action.error,
        loading: false
      };
    default:
      return state
  }
}