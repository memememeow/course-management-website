const mongoose = require('mongoose')

// connect to our database
// const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://user:user@csc309-kqlsq.mongodb.net/test?retryWrites=true'
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/StudentAPI'

//mongoose.connect('mongodb://localhost:27017/StudentAPI', { useNewUrlParser: true});
mongoose.connect(mongoURI, { useNewUrlParser: true, useCreateIndex: true});

module.exports = { mongoose }