const express = require('express');
const router = express.Router();
const log = console.log
const { User } = require('../models/user.js')
// parse incoming parameters to req.body


// Index page
router.get('/', function (req, res) {
		return res.render('registrationView')
})
// A function to handle user login.
router.post("/create", (req, res) => {
	
	let info = req.body
	let newUser = new User({
		"name": info.name,
		"email": info.email,
		"password": info.password,
		"year": parseInt(info.year),
		"programs": info.programs,
	})


	newUser.save().then((result) => {
		req.session.user  = info.name
		req.session.display = info.name
		res.send()
	}).catch((error) => {
		res.status(400).send(error)
	})

})

module.exports = router;