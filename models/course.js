const mongoose = require('mongoose');

// const StudentInfoSchema = new mongoose.Schema({
// 	name: String
// })

const CommentSchema = new mongoose.Schema({
	_id: String, //Just the name of the user, not the User Object. Prevent duplciation.
	rate: Number,
	content: String
})




const CourseSchema = new mongoose.Schema({
	code: String,
	name: String,
	semester: String,
	score: {
        type: Number,
        default: 5
    },
	times: [String],
	students: [String],
	comments: [CommentSchema],
	intro: String,
	color: String,
	section: String,
	time: String,
	location: String,
	Instructor: String
})

const Courses = mongoose.model('Courses', CourseSchema);
module.exports = { Courses };
