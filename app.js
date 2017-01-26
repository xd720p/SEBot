
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

telegramBot.bot.catch((err) => {

    console.log('Ooops', err)
});

telegramBot.bot.startPolling();

