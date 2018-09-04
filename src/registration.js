import React from 'react';
import axios from 'axios';

export default class Registration extends React.Component {
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
                    window.location.replace('./logo');
                } else {
                    this.setState({
                        error: true
                    });
                }
            });
    }
    render() {
        return (
            <div className="register">
                {this.state.error && <div className="error">TRY AGAIN</div>}
                <input
                    onChange={this.handleChange}
                    className="btn"
                    placeholder="First Name"
                    name="first"
                />
                <input
                    onChange={this.handleChange}
                    className="btn"
                    placeholder="Last Name"
                    name="last"
                />
                <input
                    onChange={this.handleChange}
                    className="btn"
                    placeholder="Email"
                    name="email"
                />
                <input
                    onChange={this.handleChange}
                    className="btn"
                    type="password"
                    placeholder="Password"
                    name="pass"
                />
                <button onClick={this.submit} className="cta">
                    Register
                </button>
            </div>
        );
    }
}
