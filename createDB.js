// /**
//  * Created by xd720p on 20.01.2017.
//  */
// let mongoose = require('mongoose');
// let vkConfig = require('./configs/vkConfig.json');
// let User = require('./models/user').User;
// mongoose.connect(vkConfig.mongoDB.prefix + vkConfig.mongoDB.host + vkConfig.mongoDB.port);
//
// let botDB = mongoose.connection;
//
// botDB.on('error', console.error.bind(console, 'connection error:'));
// botDB.once('open', function() {
//     console.log('connected');
// });
//
//
// let user = new User({
//     _id: '124',
//     first_name: 'Pet',
//     last_name: 'Car',
//     username: 'Kek',
// });
//
// user.save( function (err, user, affected) {
//     if (err) throw err;
//     console.log(user);
//
//
// });
//
// User.findOne({_id: '124'}, function (err, user) {
//     console.log(user);
// });
