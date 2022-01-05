import { MESSAGE_STATUS_GET_REQUEST, MESSAGE_STATUS_GET_SUCCESS, MESSAGE_STATUS_GET_FAILURE } from '../../constants/messageStatusConstants.js'

const initialState = {
  items: [],
  loading: false,
  error: false,
};

export function messageStatusReducer(state = initialState, action) {
  switch (action.type) {
    case MESSAGE_STATUS_GET_REQUEST:
      return { ...state,
        loading: true
      };
    case MESSAGE_STATUS_GET_SUCCESS:  
      return { ...state,
        items: action.items,
        loading: false
      };
    case MESSAGE_STATUS_GET_FAILURE:
      return { ...state,
        error: action.error,
        loading: false
      };
    default:
      return state
  }
}