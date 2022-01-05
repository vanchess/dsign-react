import { MESSAGE_IN_GET_REQUEST, MESSAGE_IN_GET_SUCCESS, MESSAGE_IN_GET_FAILURE } from '../../constants/registerConstants.js'

const initialState = {
  items: [],
  loading: false,
  error: false,
};

export function messageInReducer(state = initialState, action) {
  switch (action.type) {
    case MESSAGE_IN_GET_REQUEST:
      return { ...state,
        loading: true
      };
    case MESSAGE_IN_GET_SUCCESS:  
      return { ...state,
        items: action.items,
        loading: false
      };
    case MESSAGE_IN_GET_FAILURE:
      return { ...state,
        error: action.error,
        loading: false
      };
    default:
      return state
  }
}