let vkCallbackServer = function () {

    let vkConfig = null;
    let https = null;
    let http = null;
    let that = {};
    let listener = null;
    that.init = function () {
        let express = require('express');
        let bodyParser = require('body-parser');
        vkConfig = require('./../configs/vkCallbackServerConfig.json');
        https = require('https');
        http = require('http');
        that.callbackServer = express();
        that.callbackServer.use(bodyParser.json());
        that.callbackServer.use(bodyParser.urlencoded({extended: false}));
        that.callbackServer.set('httpport', vkConfig.server.http);
        that.callbackServer.set('httpsport', vkConfig.server.https);

    }
    that.makeServer = function () {
        let fs = require('fs');
        let options = {
            key: fs.readFileSync('/etc/letsencrypt/live/136335.simplecloud.club/privkey.pem', 'utf8'),
            cert: fs.readFileSync('/etc/letsencrypt/live/136335.simplecloud.club/cert.pem', 'utf8'),
            ca: fs.readFileSync('/etc/letsencrypt/live/136335.simplecloud.club/chain.pem', 'utf8')
        };

        https.createServer(options, that.callbackServer).listen(that.callbackServer.get('httpsport'), function (err) {
            if (err) throw err;
            console.log('Https listening on port ' + that.callbackServer.get('httpsport'));
        });

        that.callbackServer.post ('/', function (req, res, next) {
            console.log('Request: ', req.body);
            if (that.isVkApi(req)) {
                res.send("208b5a5c");
            } else if (that.isVkNewPost(req)) {
                res.status(200).send("ok");
                console.log('new_vk_post');
                listener.onNewPost(req);
            } else {
                console.log('other event');
                res.status(200).send("ok");
            }
        });

    }
    that.isVkApi = function(req) {
        return (req.body.type == vkConfig.vkposts.access.type && req.body.group_id == vkConfig.vkposts.access.group_id);
    }
    that.isVkNewPost = function(req) {
        return (req.body.type == vkConfig.vkposts.wall_post_new.type && req.body.group_id == vkConfig.vkposts.wall_post_new.group_id);
    }
    that.parsePost = function (req) {
        return req.body.text;
    }
    return that;


}();
//
// vkCallbackServer.callbackServer.post('/', function (req, res, next) {
//
// });


module.exports.vkCallbackServer = vkCallbackServer;
