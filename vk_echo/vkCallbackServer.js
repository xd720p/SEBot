//let express = require('express');
// let vkConfig = require('./../configs/vkCallbackServerConfig.json');
// let bodyParser = require('body-parser');
// let fs = require('fs');
// let https = require('https');
// let http = require('http');

let vkCallbackServer = function () {

    let vkConfig = null;
    let https = null;
    let http = null;

    return {
        init: function () {
            let express = require('express');
            let bodyParser = require('body-parser');
            vkConfig = require('./../configs/vkCallbackServerConfig.json');
            https = require('https');
            http = require('http');
            this.callbackServer = express();
            this.callbackServer.use(bodyParser.json());
            this.callbackServer.use(bodyParser.urlencoded({extended: false}));
            this.callbackServer.set('httpport', vkConfig.server.http);
            this.callbackServer.set('httpsport', vkConfig.server.https);
        },

        makeServer: function () {
            let fs = require('fs');
            let options = {
                key: fs.readFileSync('/etc/letsencrypt/live/136335.simplecloud.club/privkey.pem', 'utf8'),
                cert: fs.readFileSync('/etc/letsencrypt/live/136335.simplecloud.club/cert.pem', 'utf8'),
                ca: fs.readFileSync('/etc/letsencrypt/live/136335.simplecloud.club/chain.pem', 'utf8')
            };

            https.createServer(options, this.callbackServer).listen(this.callbackServer.get('httpsport'), function (err) {
                if (err) throw err;
                console.log('Https listening on port ' + this.callbackServer.get('httpsport'));
            });
        }
    }

};

module.exports.vkCallbackServer = vkCallbackServer;

let p = vkCallbackServer();

p.callbackServer.post('/', function (req, res, next) {
    console.log('Request: ', req.body);
   if (isVkApi(req)) {
        res.send("208b5a5c");
   } else if (isVkNewPost(req)) {
       res.status(200).send("ok");
       console.log('new_vk_post');
   } else {
       console.log('other event');
       res.status(200).send("ok");
   }
});

p.callbackServer.get('/', function (req, res, next) {
    console.log('Request: ', req.body);
    res.send("Hello world");
});


function isVkApi(req) {
    return (req.body.type == vkConfig.vkposts.access.type && req.body.group_id == vkConfig.vkposts.access.group_id);
}

function isVkNewPost(req) {
    return req.body.type == vkConfig.vkposts.wall_post_new.type;
}


// module.exports.callbackServer = callbackServer;