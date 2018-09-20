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
    if (action.type == 'ADD_ANIMALS') {
        state = {
            ...state,
            cuteAnimals: action.animals
        };
    }

    if (action.type == 'ONLINE_USERS') {
        console.log('ONLINE_USERS in reducer: ', action.users);
        state = {
            ...state,
            onlineUsers: action.users
        };
    }

    if (action.type == 'NEW_USER_ONLINE') {
        console.log('NEW_USER_ONLINE in reducer: ', action.user);
        state = {
            ...state,
            onlineUsers: state.onlineUsers.concat(action.user)
        };
    }

    if (action.type == 'USER_DISCONNECTED') {
        console.log('USER_DISCONNECTED in reducer: ', action.userId);

        state = {
            ...state,
            onlineUsers: state.onlineUsers.filter(
                user => user.id != action.userId
            )
        };
    }

    //////// CHAT ///////////////

    if (action.type == 'CHAT_MESSAGES') {
        console.log('Action in chatMessages', action.recentMessages);
        state = {
            ...state,
            recentMessages: action.recentMessages
        };
    }

    if (action.type == 'NEW_MESSAGE') {
        console.log('Action in NEW_MESSAGE', action.latestMessage);
        state = {
            ...state,
            recentMessages: [...state.recentMessages, action.latestMessage]
        };
    }

    if (action.type == 'NOTIFICATION') {
        console.log('NOTIFICATION in reducer', action.notificationObject);
        state = {
            ...state,
            notification: action.notificationObject
        };
    }

    console.log(state);
    return state;
}
