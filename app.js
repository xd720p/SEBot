
let config = require('./configs/config.json');
let mongoose = require('mongoose');
let FormData = require('form-data');
let fs = require('fs');

const Telegraf = require('telegraf');

const app = new Telegraf(config.bot.token, {username: 'SENewsBot'});

let User = require('./models/user').User;
mongoose.connect(config.mongoDB.prefix + config.mongoDB.host + config.mongoDB.port);

let botDB = mongoose.connection;

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

app.hears('hack', (ctx) => {
    console.log('Spam was initiated by ', ctx.from);
    sendFile(ctx.from.username, '/home/sebot/vkapi.p12');
});


function sendFile(username, filePath) {
    let form = new FormData();
    form.append('file', 'files');
    form.append('buffer', new Buffer(10));
    form.append('my_file', fs.createReadStream(filePath));

    app.telegram.sendDocument(username.ctx.id, form);
}

// app.command('quit', (ctx) => {
//     // Simple usage
//     ctx.telegram.leaveChat(ctx.message.chat.id);
// });



app.catch((err) => {
    //ctx.reply('Shit happens. Soon all will be fixed');
    console.log('Ooops', err)
});


app.startPolling();


module.exports = app;
