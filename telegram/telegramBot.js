let telegramBot = function () {

    let that = {};
    let Telegraf = null;
    let User = null;
    let mongoose = null;
    let botDB = null;
    let config = null;

    that.init = function () {
        let telegramConfig = require('.././configs/telegrammBotConfig.json');
        Telegraf = require('telegraf');
        that.bot = new Telegraf(telegramConfig.bot.token, {username: 'SENewsBot'});
        User = require('.././models/user').User;
        mongoose = require('mongoose');
        let config = require('.././configs/appConfig.json');
        mongoose.connect(config.mongoDB.prefix + config.mongoDB.host + config.mongoDB.port);
        let botDB = mongoose.connection;

        botDB.on('error', console.error.bind(console, 'connection error:'));
        botDB.once('open', function () {
            console.log('connected');
        });

        that.bot.command('start', (ctx) => {
            console.log('start', ctx.from);
            telegramBot.saveUserToBd(ctx);

        });

        that.bot.command('quit', (ctx) => {
            console.log('start', ctx.from);
            telegramBot.saveUserToBd(ctx);

        });


        that.bot.command('help', (ctx) => {
            console.log('help', ctx.from);
            telegramBot.replyToSender(ctx, 'This is help!');
        });

        that.bot.onText(/\/echo (.+)/, function (msg, match) {
            telegramBot.replyToSender(msg.chat.id, match[1]);
        });

        that.bot.catch((err) => {

            console.log('Ooops', err)
        });
    }, that.saveUserToBd = function (ctx) {
        let user = new User({
            _id: ctx.from.id,
            first_name: ctx.from.first_name,
            last_name: ctx.from.last_name,
            username: ctx.from.username,
            subscription: true
        });

        User.findOne({_id: ctx.from.id}, function (err, result) {
            if (!result) {
                user.save(function (err, savedUser, affected) {
                    if (err) {
                        throw err;
                    } else {
                        console.log(savedUser);
                        ctx.reply(that.greetings(ctx, 'Welcome, '))
                    }
                });
            } else {
                ctx.reply(that.greetings(ctx, 'Welcome back, '));
            }
        });
    }, that.greetings = function (ctx, message) {
        if (ctx.from.first_name != undefined) {
            if (ctx.from.last_name != undefined) {
                return message + ctx.from.first_name + ' ' + ctx.from.last_name;
            } else if (ctx.from.username != undefined) {
                return message + ctx.from.username;
            } else {
                return message + ctx.from.first_name;
            }
        } else {
            return message + ctx.from.username;
        }
    }, that.sendToAll = function (message) {
        User.find({subscription: true}, function (err, foundUsers) {
            foundUsers.forEach(function (item, i, arr) {
                console.log("username: ", item.username);
                that.bot.telegram.sendMessage(item._id, message);
            })
        });
    };
    that.replyToSender = function (ctx, message) {
            ctx.reply(message);
    };
    that.reply = function (message) {
        that.bot.telegram.sendMessage(37729716, message);
    };

    return that;
}();

module.exports.telegramBot = telegramBot;