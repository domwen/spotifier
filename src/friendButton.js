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
            .then(response => {
                console.log('Response from friendshipstatus: ', response);

                if (response.data == '') {
                    this.setState({
                        buttonlabel: 'Make friend  request',
                        buttonStatus: 0
                    });
                } else if (response.data.status == 1) {
                    if ((response.data.receiver_id = this.props.receiver_id)) {
                        this.setState({
                            buttonText: 'Friend Request From x',
                            buttonStatus: 1
                        });
                    } else {
                        this.setState({
                            buttonText: 'Request is pending. Cancel?',
                            buttonStatus: 1
                        });
                    }
                } else if (response.data.status == 2) {
                    this.setState({
                        buttonText: 'You are friends :) ',
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
            var friendshipStatus = 1;
            axios
                .post('/friendRequest', {
                    friendshipStatus: friendshipStatus,
                    receiver_id: receiver_id
                })
                .then(results => {
                    console.log('After First Request', results);
                });
        } else if (this.state.buttonStatus == 1) {
            // do nothing...
            // console.log("We are here 2");
            // var status2 = 2;
            // axios
            //     .post("/friendRequest", {
            //         status: status2,
            //         receiver_id: receiver_id
            //     })
            //     .then(results => {
            //         console.log("After Pending", results);
            //     });
        } else if (this.state.buttonStatus == 2) {
            // unfriend
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
