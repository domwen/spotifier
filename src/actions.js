import axios from './axios';

export async function receiveTrackQueries() {
    console.log("ACTION receiveTrackQueries dispatched");
    const { data } = await axios.get('/receiveTrackQueries');
    console.log('DATA in axios from receiveTrackQueries :', data);
    return {
        type: 'RECEIVE_TRACK_QUERIES',
        trackQueries: data
    };
}

export function saveTrackQuery(query) {
    console.log("Inside ACTION saveTrackQuery: ", query);
    return axios
        .post(`/saveTrackQuery`, {
            query: query
        })
        .then(response => {

            console.log("Response from saveTrackQuery:", response.data.query);
            return {
                type: 'SAVE_TRACK_QUERY',
                trackQuery: response.data.query
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
