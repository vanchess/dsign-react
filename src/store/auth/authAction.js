import { authService } from '../../services';
import { AUTH_USER_LOGIN_REQUEST, AUTH_USER_LOGIN_SUCCESS, AUTH_USER_LOGIN_FAILURE } from '../../constants/authConstants.js'
import { AUTH_USER_LOGOUT_REQUEST, AUTH_USER_LOGOUT_SUCCESS, AUTH_USER_LOGOUT_FAILURE } from '../../constants/authConstants.js'
import history from '../../history';

export const authLoginRequest = () => {
  return { type: AUTH_USER_LOGIN_REQUEST }
};

export const authLoginSuccess = (user) => {
  return { type: AUTH_USER_LOGIN_SUCCESS, user: user}
};

export const authLoginFailure = (error) => {
  return { type: AUTH_USER_LOGIN_FAILURE, error: error }
};

export const login = (email, password) => {
  return (dispatch) => {
    dispatch(authLoginRequest());
    
    authService.login(email, password).then(
        user  => { 
            localStorage.setItem('user', JSON.stringify(user));
            dispatch(authLoginSuccess(user));
            history.push('/');
        },
        error => dispatch(authLoginFailure(error))
      );
  }
}