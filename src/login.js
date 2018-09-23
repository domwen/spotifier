import React from 'react';
import axios from './axios';

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.submit = this.submit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(e) {
        this[e.target.name] = e.target.value;
    }
    submit() {
        console.log('Inside Axios :', this.email, this.pass);
        axios
            .post('/login', {
                email: this.email,
                pass: this.pass
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
                <div >
                    {this.state.error && <div className="error">TRY AGAIN</div>}
                    <div className="6u 12u$(xsmall)">
                        <input
                            onChange={this.handleChange}
                            placeholder="Email"
                            name="email"
                            type="email"
                        />
                    </div>
                    <div className="6u 12u$(xsmall)">
                        <input
                            onChange={this.handleChange}
                            className="6u 12u$(xsmall)"
                            type="password"
                            placeholder="Password"
                            name="pass"
                        />
                    </div>
                    <button onClick={this.submit} className="special">
                        Login
                    </button>
                </div>
            </div>
        );
    }
}
