export default function Reducer(state = {}, action) {
    if (action.type == 'RECEIVE_TRACK_QUERIES') {
        state = {
            ...state,
            trackQueries: action.trackQueries
        };
    }
    if (action.type == 'SAVE_TRACK_QUERY') {
        state = {
            ...state,
            trackQueries: action.trackQuery
        };
    }
    // if (action.type == 'UNFRIEND') {
    //     console.log('Action in UNFRIEND!: ', action);
    //     state = {
    //         ...state,
    //         users:
    //             state.users &&
    //             state.users.filter(user => user.id != action.receiver_id)
    //     };
    // }
    //
    //
    // if (action.type == 'ONLINE_USERS') {
    //     console.log('ONLINE_USERS in reducer: ', action.users);
    //     state = {
    //         ...state,
    //         onlineUsers: action.users
    //     };
    // }
    //
    // if (action.type == 'NEW_USER_ONLINE') {
    //     console.log('NEW_USER_ONLINE in reducer: ', action.user);
    //     state = {
    //         ...state,
    //         onlineUsers: state.onlineUsers.concat(action.user)
    //     };
    // }
    //
    // if (action.type == 'USER_DISCONNECTED') {
    //     console.log('USER_DISCONNECTED in reducer: ', action.userId);
    //
    //     state = {
    //         ...state,
    //         onlineUsers: state.onlineUsers.filter(
    //             user => user.id != action.userId
    //         )
    //     };
    // }



    if (action.type == 'NOTIFICATION') {
        console.log('NOTIFICATION in reducer', action.notificationObject);
        state = {
            ...state,
            notification: action.notificationObject
        };
    }

    // console.log(state);
    return state;
}
