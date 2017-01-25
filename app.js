
let vkCallbackApi = require('./vk/vkCallbackServer').vkCallbackServer;
let telegramBot = require('./telegram/telegramBot').telegramBot;

vkCallbackApi.init();
vkCallbackApi.makeServer();

telegramBot.init();

vkCallbackApi.callbackServer.post('/', function (req, res, next) {
    console.log('Request: ', req.body);
    if (vkCallbackApi.isVkApi(req)) {
        res.send("208b5a5c");
    } else if (vkCallbackApi.isVkNewPost(req)) {
        res.status(200).send("ok");
        console.log('new_vk_post');
    } else {
        console.log('other event');
        res.status(200).send("ok");
    }
});

vkCallbackApi.callbackServer.get('/', function (req, res, next) {
    console.log('Request: ', req.body);
    res.send("Hello world");
});



telegramBot.bot.command('start', (ctx) => {
    console.log('start', ctx.from);
    telegramBot.saveUserToBd(ctx);

});

telegramBot.bot.command('quit', (ctx) => {
    console.log('start', ctx.from);
    telegramBot.saveUserToBd(ctx);

});

// function saveUserToBd(ctx) {
//     let user = new User({
//         _id: ctx.from.id,
//         first_name: ctx.from.first_name,
//         last_name: ctx.from.last_name,
//         username: ctx.from.username,
//         subscription: true
//     });
//
//     User.findOne({_id: ctx.from.id}, function (err, result) {
//        if (!result) {
//           user.save (function(err, savedUser, affected) {
//                if (err) {
//                    throw err;
//                } else {
//                    console.log(savedUser);
//                    ctx.reply(greetings(ctx, 'Welcome, '))
//                }
//            });
//        } else {
//            ctx.reply(greetings(ctx, 'Welcome back, '));
//        }
//     });
//
// }

// function greetings(ctx, message) {
//     if (ctx.from.first_name != undefined) {
//         if (ctx.from.last_name != undefined) {
//             return message +  ctx.from.first_name + ' ' + ctx.from.last_name;
//         } else if (ctx.from.username != undefined) {
//             return message +  ctx.from.username;
//         } else {
//             return message +  ctx.from.first_name;
//         }
//     } else {
//         return message +  ctx.from.username;
//     }
// }

telegramBot.bot.command('help', (ctx) => {
    console.log('help', ctx.from);
    telegramBot.reply(ctx, 'This is help!');

});

telegramBot.bot.hears('spam', (ctx) => {
    console.log('Spam was initiated by ', ctx.from);
    telegramBot.sendSpamToAll(ctx.from.username);
});
//
// function sendSpamToAll(username) {
//     User.find({subscription: true}, function (err, foundUsers) {
//         foundUsers.forEach(function (item, i, arr) {
//             app.telegram.sendMessage(item._id, "Spam from @" + username);
//         })
//     });
// }
//

telegramBot.bot.catch((err) => {
    //ctx.reply('Shit happens. Soon all will be fixed');
    console.log('Ooops', err)
});

telegramBot.bot.startPolling();


module.exports = app;
