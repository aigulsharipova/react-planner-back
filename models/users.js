const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersSchema = new Schema({
    login: { type : String , unique : true, required : true, dropDups: true },
    email: { type : String , unique : true, required : true, dropDups: true },
    password: String
});

module.exports = mongoose.model('Users', usersSchema);