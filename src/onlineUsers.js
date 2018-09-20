import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
// import { onlineUsers } from './actions';

class OnlineUsers extends React.Component {
    constructor() {
        super();
    }

    render() {
        if (!this.props.onlineUsers) {
            return null;
        }
        return (
            <div>
                <h3> ONLINE USERS </h3>
                <div id="gridContainer">
                    {this.props.onlineUsers.map(onlineUser => (
                        <div key={onlineUser.id} className="userBoxForGrid">
                            <Link to={`user/${onlineUser.id}`}>
                                <p>
                                    {onlineUser.first} {onlineUser.last}
                                </p>
                                <img
                                    className="img"
                                    src={
                                        onlineUser.url ||
                                        '../Portrait_Placeholder.png'
                                    }
                                />
                            </Link>
                        </div>
                    ))}
                </div>
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
