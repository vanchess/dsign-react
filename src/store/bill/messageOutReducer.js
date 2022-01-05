import { MESSAGE_OUT_GET_REQUEST, MESSAGE_OUT_GET_SUCCESS, MESSAGE_OUT_GET_FAILURE } from '../../constants/billConstants.js'

const initialState = {
  items: [],
  loading: false,
  error: false,
};

export function messageOutReducer(state = initialState, action) {
  switch (action.type) {
    case MESSAGE_OUT_GET_REQUEST:
      return { ...state,
        loading: true
      };
    case MESSAGE_OUT_GET_SUCCESS:  
      return { ...state,
        items: action.items,
        loading: false
      };
    case MESSAGE_OUT_GET_FAILURE:
      return { ...state,
        error: action.error,
        loading: false
      };
    default:
      return state
  }
}