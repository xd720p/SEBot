let express = require('express');
let config = require('./configs/config.json');
let mongoose = require('mongoose');

const Telegraf = require('telegraf');

const app = new Telegraf(config.bot.token, {username: 'SENewsBot'});

let User = require('./models/user').User;
mongoose.connect(config.mongoDB.prefix + config.mongoDB.host + config.mongoDB.port);

let botDB = mongoose.connection;


let bodyParser = require('body-parser');
let fs = require('fs');
let https = require('https');
let http = require('http');
let vkConfig = require('./configs/vkCallbackServerConfig.json');

let callbackServer = express();
callbackServer.use(bodyParser.json());
callbackServer.use(bodyParser.urlencoded({extended: false}));
callbackServer.set('httpport', vkConfig.server.http);
callbackServer.set('httpsport', vkConfig.server.https);

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
        res.status(200).send("ok");
        console.log('new_vk_post');
        sendPostToTelegram(req);
    } else {
        console.log('other event');
        res.status(200).send("ok");
    }
});

callbackServer.get('/', function (req, res, next) {
    console.log('Request: ', req.body);
    res.send("Hello world");
});

function sendPostToTelegram(req) {
    let post = req.body.object.text;

    app.telegram.sendMessage(37729716, post);
}

function isVkApi(req) {
    return (req.body.type == vkConfig.vkposts.access.type && req.body.group_id == vkConfig.vkposts.access.group_id);
}

function isVkNewPost(req) {
    return req.body.type == vkConfig.vkposts.wall_post_new.type;
}

botDB.on('error', console.error.bind(console, 'connection error:'));
botDB.once('open', function() {
    console.log('connected');
});


app.command('start', (ctx) => {
    console.log('start', ctx.from);
    saveUserToBd(ctx);

});

app.command('quit', (ctx) => {
    console.log('start', ctx.from);
    saveUserToBd(ctx);

});

function saveUserToBd(ctx) {
    let user = new User({
        _id: ctx.from.id,
        first_name: ctx.from.first_name,
        last_name: ctx.from.last_name,
        username: ctx.from.username,
        subscription: true
    });

    User.findOne({_id: ctx.from.id}, function (err, result) {
       if (!result) {
          user.save (function(err, savedUser, affected) {
               if (err) {
                   throw err;
               } else {
                   console.log(savedUser);
                   ctx.reply(greetings(ctx, 'Welcome, '))
               }
           });
       } else {
           ctx.reply(greetings(ctx, 'Welcome back, '));
       }
    });


}

function greetings(ctx, message) {
    if (ctx.from.first_name != undefined) {
        if (ctx.from.last_name != undefined) {
            return message +  ctx.from.first_name + ' ' + ctx.from.last_name;
        } else if (ctx.from.username != undefined) {
            return message +  ctx.from.username;
        } else {
            return message +  ctx.from.first_name;
        }
    } else {
        return message +  ctx.from.username;
    }
}

app.command('help', (ctx) => {
    console.log('help', ctx.from);
    ctx.reply('This is help!');

});

app.hears('spam', (ctx) => {
    console.log('Spam was initiated by ', ctx.from);
    sendSpamToAll(ctx.from.username);
});

function sendSpamToAll(username) {
    User.find({subscription: true}, function (err, foundUsers) {
        foundUsers.forEach(function (item, i, arr) {
            app.telegram.sendMessage(item._id, "Spam from @" + username);
        })
    });
}


app.catch((err) => {
    //ctx.reply('Shit happens. Soon all will be fixed');
    console.log('Ooops', err)
});


app.startPolling();


module.exports = app;
