import React from 'react';
import axios from './axios';
import { Link } from 'react-router-dom';

export default class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.submit = this.submit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(e) {
        this[e.target.name] = e.target.value;
        console.log("e.target.name", e.target.name);
    }
    submit() {
        console.log(
            'Inside Axios :',
            this.email,
            this.pass,
            this.first,
            this.last
        );
        axios
            .post('/register', {
                email: this.email,
                pass: this.pass,
                first: this.first,
                last: this.last
            })
            .then(({ data }) => {
                console.log('Data after saving user :', data);
                if (data.success) {
                    console.log('data.success: ', data);
                    window.location.replace('./');
                } else {
                    this.setState({
                        error: true
                    });
                }
            });
    }
    render() {
        return (
            <div>
                {this.state.error && <div className="error">TRY AGAIN</div>}
                <input
                    onChange={this.handleChange}
                    className="btn"
                    placeholder="First Name"
                    name="first"
                    type="text"

                />
                <input
                    onChange={this.handleChange}
                    className="btn"
                    placeholder="Last Name"
                    name="last"
                    type="text"

                />
                <input
                    onChange={this.handleChange}
                    className="btn"
                    placeholder="Email"
                    name="email"
                    type="email"

                />
                <input
                    onChange={this.handleChange}
                    className="btn"
                    type="password"
                    placeholder="Password"
                    name="pass"
                />
                <button onClick={this.submit} className="special">
                    Register
                </button>
                <div id="loginBox">
                    Already a member?<Link to="/login">
                        {' '}
                        Click here to login
                    </Link>
                </div>
            </div>
        );
    }
}
