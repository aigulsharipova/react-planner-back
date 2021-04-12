const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://aigul:a19101910@aigul.ofs4f.mongodb.net/project4?retryWrites=true&w=majority', {
	useNewUrlParser: true, 
	useCreateIndex: true,
	useUnifiedTopology: true 
});

const db = mongoose.connection;

db.on('connected', function() {
    console.log(`Connected to MongoDB at ${db.host}:${db.port}`);
});