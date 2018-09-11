import React from 'react';
import axios from './axios';

export default class FriendButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonlabel: 'No info'
        };
        this.friendRequest = this.friendRequest.bind(this);
    }

    componentDidMount() {
        axios.get(`/friendship-status/${this.props.otherId}`).then(response => {
            console.log('Response from friendshipstatus: ', response);

            if (response.data == '') {
                this.setState = {
                    buttonlabel: 'Make friend  request',
                    buttonStatus: 0
                };
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

    render() {
        return (
            <button name="friendButton" className="cta">
                {this.state.buttonlabel}
            </button>
        );
    }
}
