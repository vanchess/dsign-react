import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { ruRU } from '@mui/x-data-grid/locales';
import './index.css';
import App from './App';
//import * as serviceWorker from './serviceWorker';

import rootReducer from './store';
import history from './history';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

const theme = createTheme({}, ruRU);

ReactDOM.render((
        <React.StrictMode>
            <Provider store={store}>
                <Router history={history}>
                    <StyledEngineProvider injectFirst>
                        <ThemeProvider theme={theme}>
                            <App />
                        </ThemeProvider>
                    </StyledEngineProvider>
                </Router>
            </Provider>
        </React.StrictMode>
    ), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
