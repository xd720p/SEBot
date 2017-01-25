/**
 * Created by xd720p on 20.01.2017.
 */
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let schema = new Schema({

    _id: {
        type: String,
        required: true
    },
    first_name: {
        type: String,
        required: false
    },
    last_name: {
        type: String,
        required: false
    },
    username: {
        type: String,
        required: false
    },
    subscription: {
        type: Boolean,
        required: true
    }

});

exports.User = mongoose.model('User', schema);

