import { MEE_MESSAGE_IN_GET_REQUEST, MEE_MESSAGE_IN_GET_SUCCESS, MEE_MESSAGE_IN_GET_FAILURE } from '../../constants/expertiseConstants.js'

const initialState = {
  items: [],
  loading: false,
  error: false,
};

export function meeMessageInReducer(state = initialState, action) {
  switch (action.type) {
    case MEE_MESSAGE_IN_GET_REQUEST:
      return { ...state,
        loading: true
      };
    case MEE_MESSAGE_IN_GET_SUCCESS:  
      return { ...state,
        items: action.items,
        loading: false
      };
    case MEE_MESSAGE_IN_GET_FAILURE:
      return { ...state,
        error: action.error,
        loading: false
      };
    default:
      return state
  }
}