import { AUTH_USER_LOGIN_REQUEST, AUTH_USER_LOGIN_SUCCESS, AUTH_USER_LOGIN_FAILURE } from '../../constants/authConstants.js'
import { AUTH_USER_LOGOUT_REQUEST, AUTH_USER_LOGOUT_SUCCESS, AUTH_USER_LOGOUT_FAILURE } from '../../constants/authConstants.js'

const initialState = {
  user: JSON.parse(localStorage.getItem('user')),
  loading: false,
  error: false,
};

export function authReducer(state = initialState, action) {
  switch (action.type) {
    case AUTH_USER_LOGIN_REQUEST:
      return { ...state,
        loading: true
      };
    case AUTH_USER_LOGIN_SUCCESS:  
      return { ...state,
        user: action.user,
        loading: false
      };
    case AUTH_USER_LOGIN_FAILURE:
      return { ...state,
        error: action.error,
        loading: false
      };
    default:
      return state
  }
}