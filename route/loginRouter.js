const express = require('express');
const router = express.Router();
const log = console.log
const { User } = require('../models/user.js')



// Index page
router.get('/', function (req, res) {
	if(! req.session.user) {
		return res.render('login')
	} else {
        if(req.session.display !== req.session.user){
            req.session.display = req.session.user
        }
		return res.redirect('userprofile')
	}
});


// A function to handle user login.
router.post("/userlogin", (req, res) => {
	let loginInfo = req.body
	User.find({'name':loginInfo.name, 'password':loginInfo.password}).then((user) => {
		if(user.length == 0) {
			res.redirect('/')
		}
		req.session.user = loginInfo.name
		req.session.display = loginInfo.name
		return res.redirect('userprofile')
		
	}).catch((err) => {
		res.status(400).send(err)
	})
})

module.exports = router;