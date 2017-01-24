let express = require('express');
let http = require('http');
let config = require('./configs/vkCallbackServerConfig.json');
let bodyParser = require('body-parser');
const fs = require('fs');
const https = require('https');

const options  = {
    key: fs.readFileSync('/etc/letsencrypt/live/136335.simplecloud.club/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/136335.simplecloud.club/cert.pem')
};

let callbackServer = express();
callbackServer.use(bodyParser.json());
callbackServer.use(bodyParser.urlencoded({extended: false}));
callbackServer.set('port', config.server.port);



https.createServer(callbackServer).listen(options, callbackServer.get('port'), function (err) {
    if (err) throw err;
    console.log('Server listening on port ' + callbackServer.get('port'));
});

callbackServer.post('/', function (req, res, next) {
   if (isVkApi(req)) {
        res.send("208b5a5c");
   } else {
       res.send("false");
   }
});


function isVkApi(req) {

    if (req.body.type == config.vkposts.access.type && req.body.group_id == config.vkposts.access.group_id) {
        return true;
    }
    return false;

}