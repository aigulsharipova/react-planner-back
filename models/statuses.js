const mongoose = require('mongoose');
const Schema = mongoose.Schema;
	
const statusSchema = new Schema({
    title: String
});

module.exports = mongoose.model('Statuses', statusSchema);