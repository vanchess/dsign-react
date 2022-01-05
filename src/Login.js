import React from 'react';
import SignIn from './sign-in/SignIn.js'
// import SignIn from './sign-in/SignInSide.js'
import { Redirect } from 'react-router-dom';

class Login extends React.Component {

    
    render(){
      return (
        localStorage.getItem('user')
            ? <Redirect to={{ pathname: '/' }} />
            : <SignIn />
      );
    }
}

export default Login;
