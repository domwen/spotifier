import { connect } from 'react-redux';
import React from 'react';
import { friendNotification } from './actions';
import { Link } from 'react-router-dom';

export class Notify extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.timeOut = this.timeOut.bind(this);
    }

    timeOut() {
        setTimeout(() => {
            this.props.dispatch(friendNotification(null));
        }, 10000);
    }

    render() {
        console.log('Inside  render: ', this.props.notification);
        if (!this.props.notification) {
            return null;
        }
        this.timeOut();
        console.log('STATE in notification:: ', this.props.notification);
        return (
            <div>
                <Link to="/friends">
                    <h1>
                        {this.props.notification.message}{' '}
                        {this.props.notification.senderFirst}{' '}
                        {this.props.notification.senderLast}.
                    </h1>
                </Link>
            </div>
        );
    }
}

const mapStateToProps = state => {
    console.log('state. notifaction:::', state);
    return {
        notification: state.notification
    };
};

export default connect(mapStateToProps)(Notify);
