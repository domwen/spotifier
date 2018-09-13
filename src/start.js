import React from 'react';
import ReactDOM from 'react-dom';
import Welcome from './welcome';
import App from './app';
import { createStore, applyMiddleware } from 'redux';
import reduxPromise from 'redux-promise';
import { composeWithDevTools } from 'redux-devtools-extension';
import Reducer from './reducer';
import { Provider } from 'react-redux';

const store = createStore(
    Reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);
let elem;
if (location.pathname == '/welcome') {
    elem = <Welcome />;
} else {
    elem = (
        <Provider store={store}>
            <App />
        </Provider>
    );
}

ReactDOM.render(elem, document.querySelector('main'));
