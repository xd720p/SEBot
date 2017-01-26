
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







telegramBot.bot.startPolling();

