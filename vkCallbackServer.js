let express = require('express');
let config = require('./configs/vkCallbackServerConfig.json');
let bodyParser = require('body-parser');
let fs = require('fs');
let https = require('https');
let http = require('http');

let callbackServer = express();
callbackServer.use(bodyParser.json());
callbackServer.use(bodyParser.urlencoded({extended: false}));
callbackServer.set('httpport', config.server.http);
callbackServer.set('httpsport', config.server.https);

const options  = {
    key: fs.readFileSync('/etc/letsencrypt/live/136335.simplecloud.club/privkey.pem', 'utf8'),
    cert: fs.readFileSync('/etc/letsencrypt/live/136335.simplecloud.club/cert.pem', 'utf8'),
    ca: fs.readFileSync('/etc/letsencrypt/live/136335.simplecloud.club/chain.pem', 'utf8')
};

https.createServer(options, callbackServer).listen(callbackServer.get('httpsport'), function (err) {
    if (err) throw err;
    console.log('Https listening on port ' + callbackServer.get('httpsport'));
});

callbackServer.post('/', function (req, res, next) {
    console.log('Request: ', req.body);
   if (isVkApi(req)) {
        res.send("208b5a5c");
   } else if (isVkNewPost(req)) {
       console.log('new_vk_post');
       res.status(200).send("ok");
   } else {
       console.log('other event');
       res.status(200).send("ok");
   }
});

callbackServer.get('/', function (req, res, next) {
    console.log('Request: ', req.body);
    res.send("Hello world");
});


function isVkApi(req) {
    return (req.body.type == config.vkposts.access.type && req.body.group_id == config.vkposts.access.group_id);
}

function isVkNewPost(req) {
    return req.body.type == config.vkposts.wall_post_new;
}