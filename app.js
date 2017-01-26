
let vkCallbackApi = require('./vk/vkCallbackServer').vkCallbackServer;
let telegramBot = require('./telegram/telegramBot').telegramBot;



let listener = {
    onNewPost: function (req) {
        telegramBot.sendToAll(req.body.object.text);
    }
};
vkCallbackApi.init(listener);
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


telegramBot.bot.command('help', (ctx) => {
    console.log('help', ctx.from);
    telegramBot.reply(ctx, 'This is help!');

});

telegramBot.bot.hears('spam', (ctx) => {
    console.log('Spam was initiated by ', ctx.from);
    telegramBot.sendToAll(ctx.from.username);
});
telegramBot.bot.catch((err) => {

    console.log('Ooops', err)
});

telegramBot.bot.startPolling();

