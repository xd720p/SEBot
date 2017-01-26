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
    }, that.sendToAll = function (username) {
        User.find({subscription: true}, function (err, foundUsers) {
            foundUsers.forEach(function (item, i, arr) {
                that.bot.telegram.sendMessage(item._id, "Spam from @" + username);
            })
        });
    }, that.reply = function (ctx, message) {
        if (ctx != null) {
            ctx.reply(message);
        } else {
            that.bot.telegram.sendMessage(37729716, message);
        }

    }

    return that;
}();

module.exports.telegramBot = telegramBot;