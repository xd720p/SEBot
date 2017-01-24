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

http.createServer(callbackServer).listen(callbackServer.get('httpport'), function (err) {
    if (err) throw err;
    console.log('Http listening on port ' + callbackServer.get('httpport'));
});
https.createServer(options, callbackServer).listen(callbackServer.get('httpsport'), function (err) {
    if (err) throw err;
    console.log('Https listening on port ' + callbackServer.get('httpsport'));
});

callbackServer.post('/', function (req, res, next) {
    console.log('Request: ', req);
   if (isVkApi(req)) {
        res.send("208b5a5c");
   } else {
       res.send("false");
   }
});

callbackServer.get('/', function (req, res, next) {
    console.log('Request: ', req);
    res.send("Hello world");
});


function isVkApi(req) {

    if (req.body.type == config.vkposts.access.type && req.body.group_id == config.vkposts.access.group_id) {
        return true;
    }
    return false;

}