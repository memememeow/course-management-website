const express = require('express');
const router = express.Router();
const log = console.log
const { User } = require('../models/user.js')

router.get("/", (req, res) => {
    if(!req.session.user) {
        return res.redirect("/")
    } else {
		return res.render("userprofile")
	}
})



router.get('/displayuser/:id', (req, res) => {
    // Show the user to be displayed.
	req.session.display = req.params.id
	User.find({"name":req.session.display}).then((user) => {
        if(user.length === 0) {
            res.status(404).send("No such user.")
        }
        if(req.session.display !== req.session.user){
            user[0].myInfo = false
        } else {
            user[0].myInfo = true
        }
        user.currentUser = req.session.curUser
        return res.set('application/json').send({user})
    }).catch((err) => {
        res.status(400).send(err)
    })

})



router.get('/mypage', (req, res) => {
	// Show the user to be displayed.
	User.find({"name":req.session.display}).then((user) => {
		if(user.length === 0) {
			res.status(404).send("No such user.")
		}
		if(req.session.display !== req.session.user){
			user[0].myInfo = false
		} else {
			user[0].myInfo = true
		}
		user.currentUser = req.session.curUser
		let sendback = {
		    "user":user,
            "currentuser":req.session.user
        }
        return res.set('application/json').send(sendback)
	}).catch((err) => {
		res.status(400).send(err)
	})	
	
})



router.post('/update', (req, res) => {
    User.find({'name': req.session.display}).then((find) => {
        let user = find[0]
        if(! user){
            return res.status(400).send()
        }
        let update = req.body
        if(update.year){
            user.year = update.year
        }
        if(update.email){
            user.email = update.email
        }
        if(update.intro){
            user.selfIntro = update.intro
        }
        if(update.password){
            user.password = update.password
        }
        if(update.program){
            user.programs = update.program
        }
        user.save().then(() => {
            let sendBack = {
                "user":[user],
                "currentuser":req.session.user
            }
            res.send(sendBack)
        })
    }).catch((error) => {
        res.status(400).send(error)
    })
})

module.exports = router