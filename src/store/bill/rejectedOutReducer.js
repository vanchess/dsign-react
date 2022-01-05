import { REJECTED_OUT_GET_REQUEST, REJECTED_OUT_GET_SUCCESS, REJECTED_OUT_GET_FAILURE } from '../../constants/billConstants.js'

const initialState = {
  items: [],
  loading: false,
  error: false,
};

export function rejectedOutReducer(state = initialState, action) {
  switch (action.type) {
    case REJECTED_OUT_GET_REQUEST:
      return { ...state,
        loading: true
      };
    case REJECTED_OUT_GET_SUCCESS:  
      return { ...state,
        items: action.items,
        loading: false
      };
    case REJECTED_OUT_GET_FAILURE:
      return { ...state,
        error: action.error,
        loading: false
      };
    default:
      return state
  }
}