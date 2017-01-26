
let vkCallbackApi = require('./vk/vkCallbackServer').vkCallbackServer;
let telegramBot = require('./telegram/telegramBot').telegramBot;



let listener = {
    onNewPost: function (message) {
        telegramBot.sendToAll(message);
    }

};

vkCallbackApi.init(listener);
vkCallbackApi.makeServer();
telegramBot.init();

telegramBot.bot.startPolling();

