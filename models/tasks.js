const mongoose = require('mongoose');
const Schema = mongoose.Schema;
	
const taskSchema = new Schema({
    title: String,
    desc: String,
    date_created: Date,
    date_edit: Date,
    status_id: mongoose.ObjectId,
    user_owner: mongoose.ObjectId 
});

module.exports = mongoose.model('Tasks', taskSchema);