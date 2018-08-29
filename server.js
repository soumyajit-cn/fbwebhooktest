const express = require('express');
const bodyParser = require('body-parser');

const port = process.env.PORT || 1337;
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


//Creating the endpoint of our webhook
app.post('/webhook', (req, res) => {
    let body = req.body;

    //check this is an event for a page subscription
    if(body.object == 'page'){
        // Iterates over each entry - there may be multiple if batched
        body.entry.forEach(function(entry){
            // Gets the message. entry.messaging is an array, but 
            // will only ever contain one message, so we get index 0
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);
        });

        // Returns a '200 OK' response to all requests
        res.status(200).send('EVENT_RECEIVED');
    }else{
        // Returns a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
});

// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {
    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = "EAAGiNnZB0pKQBAIunyUjEsT6k9wdE9BJli0qteH3e6V1nl0WgDyUi5UD8l9kEw8ZAvuCBfrXwX8uCK7icxSqsVGfHEHv21ZAeJDlq914pA9tntYfNrRatTMX4mx7rsbGi4hwG3jT7ZA3viKA8u5ulfYIt1yj4vxOaWLXDgLebgZDZD";

    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {

        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {

            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);

        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
});


app.listen(port, (err) => {
    if(err){
        console.log(JSON.stringify(err));
    }else{
        console.log(`Server is running on the port: ${port}`);
    }
});
