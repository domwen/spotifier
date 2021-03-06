import React from 'react';
import axios from './axios';
import { connect } from 'react-redux';
import {
    receiveFriendsAndWannabes,
    acceptFriendRequest,
    unfriend
} from './actions';
import { Link } from 'react-router-dom';

class Friends extends React.Component {
    constructor() {
        super();
    }

    // We use redux to store the list, accept friends and delete friendships,

    componentDidMount() {
        this.props.dispatch(receiveFriendsAndWannabes());
    }
    render() {
        if (!this.props.friends) {
            return null;
        }
        return (
            <div>
                <h3> FRIENDS </h3>
                <div id="gridContainer" />
                {this.props.friends.map(friend => (
                    <div key={friend.id} className="userBoxForGrid">
                        <Link to={`user/${friend.id}`}>
                            <p>
                                {friend.first} {friend.last}
                            </p>
                            <img
                                className="img"
                                src={
                                    friend.url || '../Portrait_Placeholder.png'
                                }
                            />
                        </Link>
                        <button
                            className="cta"
                            onClick={() => {
                                this.props.dispatch(unfriend(friend.id));
                            }}
                        >
                            Unfriend
                        </button>
                    </div>
                ))}
                <h3> FRIEND REQUESTS </h3>
                <div id="gridContainer" />{' '}
                {this.props.wannabes.map(wannabe => (
                    <div key={wannabe.id} className="userBoxForGrid">
                        <Link to={`user/${wannabe.id}`}>
                            <p>
                                {wannabe.first} {wannabe.last}
                            </p>
                            <img
                                className="img"
                                src={
                                    wannabe.url || '../Portrait_Placeholder.png'
                                }
                            />
                        </Link>
                        <button
                            className="cta"
                            onClick={() => {
                                this.props.dispatch(
                                    acceptFriendRequest(wannabe.id)
                                );
                            }}
                        >
                            Accept Request
                        </button>
                    </div>
                ))}
            </div>
        );
    }
}

const mapStateToProps = state => {
    // state = global redux state
    return {
        friends: state.users && state.users.filter(user => user.status == 2),
        wannabes: state.users && state.users.filter(user => user.status == 1)
    };
};
export default connect(mapStateToProps)(Friends);
