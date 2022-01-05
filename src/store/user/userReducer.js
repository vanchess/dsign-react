import { USER_GET_REQUEST, USER_GET_SUCCESS, USER_GET_FAILURE } from '../../constants/userConstants.js'

const initialState = {
  items: [],
  loading: false,
  error: false,
};

export function userReducer(state = initialState, action) {
  switch (action.type) {
    case USER_GET_REQUEST:
      return { ...state,
        loading: true
      };
    case USER_GET_SUCCESS:  
      return { ...state,
        items: action.items,
        loading: false
      };
    case USER_GET_FAILURE:
      return { ...state,
        error: action.error,
        loading: false
      };
    default:
      return state
  }
}