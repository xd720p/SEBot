//let express = require('express');
// let vkConfig = require('./../configs/vkCallbackServerConfig.json');
// let bodyParser = require('body-parser');
// let fs = require('fs');
// let https = require('https');
// let http = require('http');

let vkCallbackServer = {


    init: function () {
        vkCallbackServer.express = require('express');
        vkCallbackServer.vkConfig = require('./../configs/vkCallbackServerConfig.json');
        vkCallbackServer.bodyParser = require('body-parser');
        vkCallbackServer.fs = require('fs');
        vkCallbackServer.https = require('https');
        vkCallbackServer.http = require('http');
        vkCallbackServer.callbackServer = vkCallbackServer.express();
        vkCallbackServer.callbackServer.use(vkCallbackServer.bodyParser.json());
        vkCallbackServer.callbackServer.use(vkCallbackServer.bodyParser.urlencoded({extended: false}));
        vkCallbackServer.callbackServer.set('httpport', vkCallbackServer.vkConfig.server.http);
        vkCallbackServer.callbackServer.set('httpsport', vkCallbackServer.vkConfig.server.https);
    },

    createServer: function () {
        vkCallbackServer.options = {
            key: vkCallbackServer.fs.readFileSync('/etc/letsencrypt/live/136335.simplecloud.club/privkey.pem', 'utf8'),
            cert: vkCallbackServer.fs.readFileSync('/etc/letsencrypt/live/136335.simplecloud.club/cert.pem', 'utf8'),
            ca: vkCallbackServer.fs.readFileSync('/etc/letsencrypt/live/136335.simplecloud.club/chain.pem', 'utf8')
        };

        vkCallbackServer.https.createServer(vkCallbackServer.options, vkCallbackServer.callbackServer).listen(vkCallbackServer.callbackServer.get('httpsport'), function (err) {
            if (err) throw err;
            console.log('Https listening on port ' + vkCallbackServer.callbackServer.get('httpsport'));
        });
    }

};

vkCallbackServer.init();
vkCallbackServer.createServer();


// const options  = {
//     key: fs.readFileSync('/etc/letsencrypt/live/136335.simplecloud.club/privkey.pem', 'utf8'),
//     cert: fs.readFileSync('/etc/letsencrypt/live/136335.simplecloud.club/cert.pem', 'utf8'),
//     ca: fs.readFileSync('/etc/letsencrypt/live/136335.simplecloud.club/chain.pem', 'utf8')
// };
//
// https.createServer(options, callbackServer).listen(callbackServer.get('httpsport'), function (err) {
//     if (err) throw err;
//     console.log('Https listening on port ' + callbackServer.get('httpsport'));
// });
//
// callbackServer.post('/', function (req, res, next) {
//     console.log('Request: ', req.body);
//    if (isVkApi(req)) {
//         res.send("208b5a5c");
//    } else if (isVkNewPost(req)) {
//        res.status(200).send("ok");
//        console.log('new_vk_post');
//    } else {
//        console.log('other event');
//        res.status(200).send("ok");
//    }
// });
//
// callbackServer.get('/', function (req, res, next) {
//     console.log('Request: ', req.body);
//     res.send("Hello world");
// });
//
//
// function isVkApi(req) {
//     return (req.body.type == vkConfig.vkposts.access.type && req.body.group_id == vkConfig.vkposts.access.group_id);
// }
//
// function isVkNewPost(req) {
//     return req.body.type == vkConfig.vkposts.wall_post_new.type;
// }
//
//
// module.exports.callbackServer = callbackServer;