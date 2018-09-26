import React from 'react';
import axios from './axios';
import Uploader from './uploader';
import { BrowserRouter, Route, Link, Router } from 'react-router-dom';
import Profile from './profile';

import { connect } from 'react-redux';
// import Notify from './notification';
import Wishlist from './wishlist';
import Results from './results';


export default class App extends React.Component {
    constructor(props) {
        // prepare a class for props
        super(props);
        this.state = {};
        this.updateImage = this.updateImage.bind(this);
        this.makeUploaderVisible = this.makeUploaderVisible.bind(this);
    }
    componentDidMount() {
        axios
            .get('/user')
            .then(({ data }) => {
                if (!data.url) {
                    data.url = '/Portrait_Placeholder.png';
                }
                this.setState(data);
                console.log('componentDidMount data: ', data);
            })
            .catch(error => {
                console.log('Error in App.js GET request: ', error);
            });
    }
    makeUploaderVisible() {
        this.setState({
            uploaderIsVisible: true
        });
    }
    updateImage(imageUrl) {
        this.setState({
            url: imageUrl,
            uploaderIsVisible: false
        });
    }

    // notification() {} // dispatch the notifaction ( hide notif action that will flip the value string to faulsy val)

    render() {
        if (!this.state.id) {
            return (
                <div> Loading... </div> // you can replace it with some funny or useful image/text
            );
        }
        return (
            <BrowserRouter>
                <div>
                    {/* <Notify /> */}

                    <div id="header">
                        <h1>Spotifier</h1>
                        <Link to="/wishlist">
                            <input
                                type="submit"
                                className="special"
                                value="wishlist"
                            />
                        </Link>

                        <Link to="/profile">
                            <input
                                type="submit"
                                className="special"
                                value="Profile"
                            />
                        </Link>

                        <a href="/logout">
                            <input
                                type="submit"
                                className="special"
                                value="Logout"
                            />
                        </a>

                        {this.state.uploaderIsVisible && (
                            <Uploader
                                updateImage={this.updateImage}
                                submit={this.submit}
                            />
                        )}
                    </div>
                    <div>
                        {/* === WHY THIS PATH?? === */}
                        <Route exact path="/wishlist" component={Wishlist} />
                        <Route
                            exact
                            path="/profile"
                            render={() => (
                                <div className="profileBox">
                                    <Profile
                                        id={this.state.id}
                                        first={this.state.first}
                                        last={this.state.last}
                                        bio={this.state.bio}
                                        url={this.state.url}
                                        showBio={this.state.showBio}
                                        toggleBio={this.toggleBio}
                                        setBio={this.setBio}
                                        clickHandler={this.makeUploaderVisible}
                                    />
                                </div>
                            )}
                        />
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}
