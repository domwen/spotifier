import React from 'react';
import { HashRouter, Route } from 'react-router-dom';
import Registration from './registration';
import Login from './login.js';

export default function Welcome() {
    return (
        <div id="welcome" className="bg-pan-left">
            <h3 className="roll-in-blurred-left">Welcome to the scl ntwrk!</h3>
            <HashRouter>
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                </div>
            </HashRouter>
        </div>
    );
}
