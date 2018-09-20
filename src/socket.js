import * as io from 'socket.io-client';
import {
    onlineUsers,
    newUserOnline,
    disconnectUser,
    chatMessages,
    newChatMessage,
    friendNotification
} from './actions';

let socket;

export function getSocket(store) {
    if (!socket) {
        socket = io.connect();

        //=== LISTEN FOR EMIT FROM WHEREVER

        socket.on('onlineUsers', data => {
            console.log('OnlineUsers in socket: ', data);
            store.dispatch(onlineUsers(data));
        });

        socket.on('newUserOnline', data => {
            console.log('newUserOnline in socket ', data);
            store.dispatch(newUserOnline(data));
        });

        socket.on('disconnectUser', data => {
            console.log('We have Disconnected in Socket.js', data);
            store.dispatch(disconnectUser(data));
        });

        //== CHAT ==//
        socket.on('chatMessages', messages => {
            console.log('chatMessages in Socket ', messages);
            store.dispatch(chatMessages(messages));
        });

        socket.on('newChatMessage', message => {
            store.dispatch(newChatMessage(message));
        });

        socket.on('friendNotification', notificationObject => {
            console.log('friendNotification in socket'.notificationObject);
            store.dispatch(friendNotification(notificationObject));
        });
    }
    return socket;
}
