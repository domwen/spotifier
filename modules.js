const { spotify_ID, spotify_secret } = require('./secrets.json');
const https = require('https');

module.exports.getResults = function getResults(token, queryObj) {

    console.log("stringifiedQuery", queryObj);
    return new Promise((resolve, reject) => {
        var options = {
            method: 'GET',
            host: 'api.spotify.com',
            path: '/v1/search?' + queryObj.queryString + '&type=track&limit=5&market=DE',
            headers: {
                Authorization: 'Bearer ' + token
            }
        };

        let callback = function(response){
            console.log("Response from SAPI:", response.statusCode);
            let body ="";

            response.on("data", function(chunk) {
                body += chunk;
            });
            if (response.statusCode != 200) {
                reject(new Error(response.statusCode));
                return;
            }
            response.on("end", function() {
                // let bearerToken = JSON.parse(str).access_token;
                // console.log("Full response from SAPI", body);

                var jsonObj = JSON.parse(body);
                jsonObj.queryId = queryObj.queryId;
                jsonObj.userId = queryObj.userId;
                resolve(jsonObj);
            });

        };
        var req = https.request(options, callback);
        req.write('grant_type=client_credentials');
        req.end();

    });
};





module.exports.getToken = function getToken() {
    let concatenatedStr = spotify_ID + ':' + spotify_secret;
    let base64Encoded = new Buffer(concatenatedStr).toString('base64');
    return new Promise(function(resolve, reject) {
        const req = https.request({
            method: 'POST',
            host: 'accounts.spotify.com',
            path: '/api/token',
            headers: {
                Authorization: 'Basic  '+ base64Encoded,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }, function(resp) {
            if (resp.statusCode != 200) {
                return reject(resp.statusCode);
            }
            let body = '';
            resp.on('data', function(data) {
                body += data;
            }).on('end', function() {
                resolve(JSON.parse(body).access_token);
            }).on('error', function(err) {
                return reject(err);
            });
        });
        req.write('grant_type=client_credentials');
        req.end();
    });
}
