import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        localStorage.getItem('user')
            ? <Component {...props} setTitle={(t) => rest.handleSetTitle(t)} />
            : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
    )} />
)