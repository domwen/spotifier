export default function Reducer(state = {}, action) {
    if (action.type == 'RECEIVE_FRIENDS_WANNABES') {
        state = {
            ...state,
            users: action.users
        };
    }
    if (action.type == 'ACCEPT_FRIEND_REQUEST') {
        state = {
            ...state,
            users: state.users.map(user => {
                // console.log("out super id:", friend.id);
                // console.log("reciever ID", action.receiver_id);
                if (user.id == action.receiver_id) {
                    // console.log("we Are here in Making Friends!");
                    return {
                        ...user,
                        status: (user.status = 2)
                    };
                } else {
                    return user;
                }
            })
        };
    }
    if (action.type == 'UNFRIEND') {
        console.log('Action in UNFRIEND!: ', action);
        state = {
            ...state,
            users:
                state.users &&
                state.users.filter(user => user.id != action.receiver_id)
        };
    }
    console.log(state);
    return state;
}
