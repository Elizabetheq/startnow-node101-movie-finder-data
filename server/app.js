const express = require('express');
const morgan = require('morgan');
const axios = require('axios');
const app = express();

//set up a local cache for our / route
const cache = {
    url: null,
    data: null
};

app.use(morgan('dev'));

// When user gets localhost:3000/ run this function
app.get('/', function (req, res) {

    // If the user's request query (localhost:3000/?___) contains t do the following block
    if (req.query.t) {

        // if the user's *t* query is the same as the one we saved previously
        if (cache.url === req.query.t) {
            res.send(cache.data)
        }

        // else go to api
        else {
            //send the users *t* query to the api with the apiKey
            // When making calls to the OMDB API, we make sure to append the '&apikey=8730e0e' parameter
            axios.get('http://www.omdbapi.com/?t=' + encodeURIComponent(req.query.t) + '&apikey=8730e0e')
                .then(apiResponse => {

                    //now we have a response from the api

                    //save the response into our cache object
                    cache.data = apiResponse.data
                    cache.url = req.query.t

                    //send the response from the api back to the user
                    res.send(apiResponse.data)
                })
                //if there's an error at all, send the user what the error message says
                .catch(err => res.json(err.message));
        }
    }
    // if the user's request quest (localhost:3000/?____) contains an i, do the following block
    else if (req.query.i) {

        //if the user's *i* query is the same as the one they requested before
        if (cache.url === req.query.i) {
            //send them what we have in cache
            res.send(cache.data)
        }

        // the cache.url doesn't match the new request from the user (matrix !== thor)
        else {
            // send matrix to api
            axios.get('http://www.omdbapi.com/?i=' + req.query.i + '&apikey=8730e0e')
                .then(apiResponse => {

                    //now we have a response from the api
                    // we put that response inside apiResponse above^

                    //save the repsonse into our cache object
                    cache.data = apiResponse.data
                    cache.url = req.query.i

                    //send the response from the api back to our user
                    res.send(apiResponse.data)
                })
                // if there's an error like matrix doesn't exist, send that message to the user
                .catch(err => res.json(err.message));
        }
    }
    //If the user did not send *i* or *t* inside their request (localhost:3000/?i=___ OR localhost:3000/?t=____)
    // send them an empty object
    else res.json({});
});

module.exports = app;