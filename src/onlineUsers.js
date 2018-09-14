import React from 'react';
import axios from './axios';
import { connect } from 'react-redux';
import { onlineUsers } from './actions';

class OnlineUsers extends React.Component {
    constructor() {
        super();
    }

    componentDidMount() {
        this.props.dispatch(onlineUsers());
    }
    render() {
        if (!this.props.onlineUsers) {
            return null;
        }
        return (
            <div>
                <h4> ONLINE USERS </h4>
                <div id="gridContainer" />
                {this.props.onlineUsers.map(onlineUser => (
                    <div key={onlineUser.id} className="friends">
                        <p>
                            {onlineUser.first} {onlineUser.last}
                        </p>
                        <img
                            className="img"
                            src={
                                onlineUser.url || '../Portrait_Placeholder.png'
                            }
                        />
                    </div>
                ))}
            </div>
        );
    }
}

const mapStateToProps = state => {
    // state = global redux state
    return {
        onlineUsers: state.onlineUsers
    };
};
export default connect(mapStateToProps)(OnlineUsers);
