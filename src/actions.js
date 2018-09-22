import axios from './axios';

export async function receiveTrackQueries() {
    const { data } = await axios.get('/receiveTrackQueries');
    console.log('DATA in axios from receiveFriendsAndWannabes :', data);
    return {
        type: 'RECEIVE_TRACK_QUERIES',
        users: data
    };
}

export function saveTrackQuery(props) {
    let query = props;
    return axios
        .post(`/saveTrackQuery`, {
            query: query
        })
        .then(response => {

            console.log("Response from saveTrackQuery:", response);
            return {
                type: 'SAVE_TRACK_QUERY',
                query: response
            };
        })
        .catch(e => console.log('catch in saveTrackQuery: ', e));
}

// export function deleteTrack(query) {
//     console.log('query', query);
//     return axios
//         .post(`/deleteFriendRequest`, {
//             query: query
//         })
//         .then(response => {
//             console.log('response in unfriend: ', response);
//             return {
//                 type: 'UNFRIEND',
//                 query
//             };
//         })
//         .catch(e => console.log('catch in unfriend: ', e));
// }

// export function resultspage(users) {
//     console.log('new search results for your query!');
//     return {
//         type: 'ONLINE_USERS',
//         users
//     };
// }


// export function newResultNotification(notificationObject) {
//     console.log('NOTIFICATION RUNNING', notificationObject);
//     return {
//         type: 'NOTIFICATION',
//         notificationObject
//     };
// }
