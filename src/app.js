import React from 'react';
import axios from './axios';
import ProfilePic from './profilepic';
import Uploader from './uploader';
import { BrowserRouter, Route } from 'react-router-dom';
import Profile from './profile';
import OtherProfile from './OtherProfile';

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

    render() {
        if (!this.state.id) {
            return (
                <div> Loading... </div> // you can replace it with some funny or useful image/text
            );
        }
        return (
            <div>
                <div className="main">
                    <ProfilePic
                        url={this.state.url}
                        firstName={this.state.first}
                        lastName={this.state.last}
                        clickHandler={this.makeUploaderVisible}
                    />
                    {this.state.uploaderIsVisible && (
                        <Uploader
                            updateImage={this.updateImage}
                            submit={this.submit}
                        />
                    )}
                </div>
                <BrowserRouter>
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
                                    />
                                </div>
                            )}
                        />
                        <Route
                            exact
                            path="/user/:userId"
                            component={OtherProfile}
                        />
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}
