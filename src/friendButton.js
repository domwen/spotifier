import React from 'react';
import axios from './axios';

export default class FriendButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.friendRequest = this.friendRequest.bind(this);
    }

    componentDidMount() {
        axios
            .get(`/friendship-status/${this.props.receiver_id}`)
            .then(results => {
                console.log('Response from friendshipStatus: ', results);

                if (results.data == '') {
                    this.setState({
                        buttonlabel: 'Make A Friend Request',
                        buttonStatus: 0
                    });
                } else if (results.data.status == 1) {
                    if (results.data.sender_id == this.props.receiver_id) {
                        this.setState({
                            buttonlabel: 'Accept Friend Request',
                            buttonStatus: '1a'
                        });
                    } else {
                        this.setState({
                            buttonlabel: 'Request is pending. Cancel?',
                            buttonStatus: '1b'
                        });
                    }
                } else if (results.data.status == 2) {
                    this.setState({
                        buttonlabel: "You are friends :) Unfriend? :'(",
                        buttonStatus: 2
                    });
                }
            });
    }

    friendRequest() {
        console.log(
            'friendRequest executed! this.props.receiver_id',
            this.props.receiver_id
        );
        var receiver_id = this.props.receiver_id;

        if (this.state.buttonStatus == 0) {
            console.log('We are here');
            let friendshipStatus = 1;
            axios
                .post('/friendRequest', {
                    status: friendshipStatus,
                    receiver_id: receiver_id
                })
                .then(results => {
                    console.log('After First Request', results);
                    this.setState({
                        buttonlabel: 'Request is pending. Cancel?',
                        buttonStatus: '1b'
                    });
                });
        } else if (this.state.buttonStatus == '1a') {
            // Accept friend request
            let friendshipStatus = 2;
            axios
                .post('/friendRequest', {
                    status: friendshipStatus,
                    receiver_id: receiver_id
                })
                .then(results => {
                    console.log('After accepting friend request: ', results);
                    this.setState({
                        buttonStatus: 2,
                        buttonlabel: 'You are friends. Unfriend?'
                    });
                });
        } else if (this.state.buttonStatus == '1b') {
            // Cancel own pending friend request
            axios
                .post('/deleteFriendRequest', {
                    receiver_id: receiver_id
                })
                .then(results => {
                    console.log('After Deleting', results);
                    this.setState({
                        buttonlabel: 'Make A Friend Request',
                        buttonStatus: 0
                    });
                });
        } else if (this.state.buttonStatus == 2) {
            // Ignore other's friend request
            axios
                .post('/deleteFriendRequest', {
                    receiver_id: receiver_id
                })
                .then(results => {
                    console.log('After Deleting', results);
                    this.setState({
                        buttonlabel: 'Make A Friend Request',
                        buttonStatus: 0
                    });
                });
        }
    }

    render() {
        return (
            <button
                name="friendButton"
                className="cta"
                onClick={this.friendRequest}
            >
                {this.state.buttonlabel}
            </button>
        );
    }
}
