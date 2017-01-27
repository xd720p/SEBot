let vkCallbackServer = function () {

    let vkConfig = null;
    let https = null;
    let http = null;
    let that = {};
    let listener = null;
    let request = null;
    let date = null;
    that.init = function (listner) {
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
        listener = listner;
        request = require('request');
    };
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
                sendMessageToBot(req);//https://api.vk.com/method/users.get?user_id=

            } else {
                console.log('other event');
                res.status(200).send("ok");
            }
        });

        that.callbackServer.get('/', function (req, res, next) {
            console.log('Request: ', req.body);
            res.send("Hello world");
        });


    };
    that.isVkApi = function(req) {
        return (req.body.type == vkConfig.vkposts.access.type && req.body.group_id == vkConfig.vkposts.access.group_id);
    };
    that.isVkNewPost = function(req) {
        return (req.body.type == vkConfig.vkposts.wall_post_new.type && req.body.group_id == vkConfig.vkposts.wall_post_new.group_id);
    };
    that.parsePost = function (req) {
        return req.body.text;
    };
    sendMessageToBot = function (req) {
        let userId = req.body.object.created_by;
        getUserFI(userId, function (data, err) {
            if (err) console.log('error');
            else {
                date = new Date(req.body.object.date * 1000);
                let hours = date.getUTCHours() + ':' + date.getUTCMinutes();
                let day = date.getUTCDate() + '.' + date.getUTCMonth()+1 + '.' + date.getUTCFullYear();
                let message = day + ' в ' + hours + '\n' + data + req.body.object.text;
                listener.onNewPost(message);
            }
        });
    };

    getUserFI = function (userId, callback) {
        let reqUrl = 'https://api.vk.com/method/users.get?user_id=' + userId + '&fields=sex';
        request(reqUrl, function(error, response, body) {
            let json = JSON.parse(body);
           // console.log(body.response);
            let userFI = null;

            if (json.response[0].sex == 1) {
                userFI = json.response[0].first_name + ' ' + json.response[0].last_name + ' написала: \n'
            } else if (json.response[0].sex == 2) {
               userFI = json.response[0].first_name + ' ' + json.response[0].last_name + ' написал: \n'
            } else {
                userFI = json.response[0].first_name + ' ' + json.response[0].last_name + ' написало: \n'
            }
            callback(userFI, null);
        });
    };
    
    return that;


}();
//
// vkCallbackServer.callbackServer.post('/', function (req, res, next) {
//
// });


module.exports.vkCallbackServer = vkCallbackServer;
