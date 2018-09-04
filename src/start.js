import React from 'react';
import ReactDOM from 'react-dom';
import Welcome from './welcome';
import Logo from './logo';

// check session on the server to determine if user is logged in, then redirect to either welcome or login page
// create new DB

let elem;
if (location.pathname == '/welcome') {
    elem = <Welcome />;
} else {
    elem = <Logo />;
}

ReactDOM.render(elem, document.querySelector('main'));
