const { spotify_ID, spotify_secret } = require('./secrets.json');
const https = require('https');
const db = require("./db.js");
const querystring = require('querystring');


module.exports.filterResults = function filterResults(bigFatResultsFromSpotify) {

    var filteredResults = [];
    for (let n=0; n < bigFatResultsFromSpotify.length; n++){
        // console.log("bigFatResultsFromSpotify[" + n + "].tracks.items", bigFatResultsFromSpotify[n].tracks.items);

        // console.log("\n\n***** BEFORE FILTERING OBJECT\n");

        var queryId = bigFatResultsFromSpotify[n].queryId;
        var userIdFromResp = bigFatResultsFromSpotify[n].userId;

        var items = bigFatResultsFromSpotify[n].tracks.items;
        // console.log("items in filterResults", items);
        var resultObj = null;
        for(let i = 0; i < items.length; i++)
        {
            resultObj = {};
            // console.log("items "+ i + " :", items[i]);
            // get track id
            resultObj.trackId = items[i].id;

            // get track title
            if (items.length == 0) {
                resultObj.trackTitle = "No result found for query ID " + queryId;
            } else {
                resultObj.trackTitle = items[i].name;
            }

            // get album image and artists
            resultObj.imageUrl = "";
            if(items[i].album.images != null && items[i].album.images.length > 0)
            {
                resultObj.imageUrl = items[i].album.images[2].url;
            }

            resultObj.artistNames = "";
            if(items[i].album.artists != null && items[i].album.artists.length > 0)
            {
                var j;
                for(j = 0; j < items[i].album.artists.length; j++)
                {
                    resultObj.artistNames += items[i].album.artists[j].name + ", ";
                }
            }
            if(resultObj.artistNames.lastIndexOf(",") != -1)
            {
                resultObj.artistNames = resultObj.artistNames.substr(0, resultObj.artistNames.lastIndexOf(","));
            }

            // get external Url
            resultObj.externalUrl = "";
            if(items[i].external_urls.spotify != null)
            {
                resultObj.externalUrl = items[i].external_urls.spotify;
            }
            // console.log("\n\n*** resultObj: " + resultObj.trackId + "\n\n");
            resultObj.query =  bigFatResultsFromSpotify[n].query;

            filteredResults.push(resultObj);



            db.saveFilteredResultsInDb(resultObj.trackId, resultObj.trackTitle, resultObj.imageUrl, resultObj.artistNames, resultObj.externalUrl, queryId, userIdFromResp);
            // console.log("Resp from saveFilteredResultsInDb ", resp);



        }
        // return filteredResults;

        // console.log("filteredResults ", filteredResults);
        // sendResultsToBrowser(filteredResults);

    }
    return filteredResults ;
};

module.exports.prepareQueriesForAPI = function prepareQueriesForAPI(results){
    var queries = [];

    for (let i = 0; i < results.rows.length; i++) {
        var queryObj = {};
        queryObj.queryId = results.rows[i].id;
        queryObj.userId = results.rows[i].user_id;
        queryObj.query = results.rows[i].query;
        queryObj.queryString = querystring.stringify({query: results.rows[i].query});
        queries.push(queryObj);
        // console.log('results from queryObj.queryString: ', results.rows[i].query);
    }
    // console.log("***queries***" ,queries);
    return queries;

};

module.exports.getResults = function getResults(token, queryObj) {

    // console.log("stringifiedQuery", queryObj);
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
                jsonObj.query = queryObj.query;
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
};
