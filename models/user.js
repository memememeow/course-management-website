const mongoose = require('mongoose');

const {CourseSchema} = require("../models/course.js")

const EmailSchema = new mongoose.Schema({
	_id: String,
    other: String,
    content: String
});

const CourseInfoSchema = new mongoose.Schema({
	code: String,
	section: String,
	times: String,	// "e.g. 1-12-13 3-12-13
	location: String,
	instructor: {
		type:String,
		default: "To be announced"
    }
})


// Reservations will be embedded in the Restaurant model
const UserSchema = new mongoose.Schema({
	//_id : String, // Use email to be id.
	name: {
		type: String, 
		required: true,
		unique: true
	},
	password: { 
		type:String,
		required: true
	},
	selfIntro: {
		type: String,
		default: "Just User."
    },
	programs: {
		type: String,
		default: "Unknown"
	},
	courses:{
		type: [CourseSchema],// Stores the corse id
		default: []
	},
    year: Number,
	privateSchedule :{
		type: Number, // 1 or 0.
		default: 0
	},
    inbox: {
		type: [EmailSchema],
		default: []
	},
	send: {
		type: [EmailSchema],
		default: []
	},
	email: {
		type: String,
		default: "anemail@email.com"
	},
	isAdmin: {
		type: Boolean,
		default: false
	}
});

// Our own student finding function 
UserSchema.statics.findUser = function(userName, userPassword) {
	const User = this

	return User.find({name: userName, password: userPassword}).then((user) => {
		if (user.length == 0) {
			return Promise.reject()
		}
		// user should be a string containing only one element.
		return new Promise((resolve, reject) => {
			resolve(user)
		})
	})
}

const User = mongoose.model('User', UserSchema);
module.exports = { User };
