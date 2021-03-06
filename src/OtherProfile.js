import React, { Component } from 'react';
import axios from './axios';
// import { Link } from 'react-router-dom';
import FriendButton from './friendButton';

export default class OtherProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        axios
            .get(`/get-user/${this.props.match.params.userId}`)
            .then(response => {
                console.log('Response from get-user: ', response.data);
                console.log('Is OWN profile?: ', response.data.ownProfile);
                if (response.data.ownProfile) {
                    this.props.history.push('/');
                }

                let otherUser = response.data;
                if (!response.data.url) {
                    response.data.url = '/Portrait_Placeholder.png';
                }

                if (response.data.IdExists == false) {
                    this.setState({
                        first: 'USER DOES NOT EXIST'
                    });
                } else {
                    this.setState({
                        id: otherUser.id,
                        first: otherUser.first,
                        last: otherUser.last,
                        url: otherUser.url,
                        bio: otherUser.bio
                    });
                }
            });
    }

    render() {
        return (
            <div className="profileContainer">
                <div className="profilePic">
                    <img
                        src={this.state.url}
                        alt="ProfilePic"
                        className="profilePic"
                        onClick={this.state.clickHandler}
                    />
                </div>
                <div className="profileInfo">
                    <h4>
                        {this.state.first} {this.state.last}
                    </h4>
                    <p> Bio:</p>
                    <p>{this.state.bio}</p>
                    <p>
                        <FriendButton
                            receiver_id={this.props.match.params.userId}
                        />
                    </p>
                </div>
            </div>
        );
    }
}
