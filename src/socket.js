import * as io from 'socket.io-client';
import { onlineUsers, newUserOnline, disconnectUser } from './actions';

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

        socket.on('disonnect', data => {
            console.log('We have Disconnected in Socket.js', data);

            store.dispatch(disconnectUser(data));
        });
    }
    return socket;
}
