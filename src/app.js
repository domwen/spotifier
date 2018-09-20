import React from 'react';
import axios from './axios';
import ProfilePic from './profilepic';
import Uploader from './uploader';
import { BrowserRouter, Route, Link, Router } from 'react-router-dom';
import Profile from './profile';
import OtherProfile from './otherProfile';
import Friends from './friends';
import OnlineUsers from './onlineUsers';
import { connect } from 'react-redux';
import Notify from './notification';
import Chat from './chat';

export default class App extends React.Component {
    constructor(props) {
        // prepare a class for props
        super(props);
        this.state = {};
        this.updateImage = this.updateImage.bind(this);
        this.makeUploaderVisible = this.makeUploaderVisible.bind(this);

        this.toggleBio = this.toggleBio.bind(this);
        this.setBio = this.setBio.bind(this);
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

    toggleBio() {
        /// === GET THIS EXPLAINED
        this.setState({
            showBio: !this.state.showBio
        });
    }

    setBio(e) {
        if (e.which == 13) {
            this.setState({
                bio: e.target.value,
                showBio: false
            });

            axios
                .post('/profile', {
                    bio: e.target.value
                })
                .catch(error => {
                    console.log('Error when sending Axios POST bio .', error);
                });
        }
    }

    notification() {} // dispatch the notifaction ( hide notif action that will flip the value string to faulsy val)

    render() {
        console.log('this.props.notification', this.props.notification);

        if (!this.state.id) {
            return (
                <div> Loading... </div> // you can replace it with some funny or useful image/text
            );
        }
        return (
            <BrowserRouter>
                <div>
                    <Notify />

                    <div className="main">
                        <Link to="/chat" className="cta">
                            Chat
                        </Link>
                        <Link to="/onlineusers" className="cta">
                            Online Users
                        </Link>
                        <Link to="/friends" className="cta">
                            Friends
                        </Link>
                        <a href="/logout" className="cta">
                            Logout
                        </a>
                        <div>
                            <Link to="/">
                                <ProfilePic
                                    url={this.state.url}
                                    firstName={this.state.first}
                                    lastName={this.state.last}
                                    clickHandler={this.makeUploaderVisible}
                                />
                            </Link>
                            ID: {this.state.id}
                        </div>
                        {this.state.uploaderIsVisible && (
                            <Uploader
                                updateImage={this.updateImage}
                                submit={this.submit}
                            />
                        )}
                    </div>
                    <div>
                        {/* === WHY THIS PATH?? === */}
                        <Route
                            exact
                            path="/"
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
                        <Route
                            exact
                            path="/user/:userId"
                            component={OtherProfile}
                        />
                        <Route exact path="/chat" component={Chat} />
                        <Route exact path="/friends" component={Friends} />
                        <Route
                            exact
                            path="/onlineusers"
                            component={OnlineUsers}
                        />
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}
