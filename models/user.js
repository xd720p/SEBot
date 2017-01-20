/**
 * Created by xd720p on 20.01.2017.
 */
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let config = require('../configs/config.json');

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

// schema.methods.saveUser = function (id, firstname, lastname, username) {
//     this._id = id;
//     this.first_name = firstname;
//     this.last_name = lastname;
//     this.username = username;
// };

exports.User = mongoose.model('User', schema);

