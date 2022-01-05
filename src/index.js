import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/core/styles';
import { ruRU } from '@material-ui/data-grid';
import './index.css';
import App from './App';
//import * as serviceWorker from './serviceWorker';

import rootReducer from './store';
import history from './history';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

const theme = createMuiTheme(
    {
    },
    ruRU
);

ReactDOM.render((
      <Provider store={store}>
        <Router history={history}>
            <ThemeProvider theme={theme}>
                <App />
            </ThemeProvider>
        </Router>
      </Provider>
    ), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
