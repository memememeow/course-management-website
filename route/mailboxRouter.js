const express = require('express');
const router = express.Router();
const log = console.log
const { User } = require('../models/user')


router.get("/", (req, res) => {

    if(req.session.user === "notUser" || !req.session.user) {
        res.render("login")
        return log("Not logged in")
    }

    res.render("mailbox")
})

// Handles the add mail operation.
router.post("/add", (req, res) => {
    let date = now()
    User.find({'name':req.body.receiver}).then((receivers) => {
        if(! receivers[0]){
            return res.status(404).send("Can not find such receiver")
        }
        let receiver = receivers[0]
        let mail = {
            _id: date,
            other:req.session.user,
            content:req.body.content
        }
        receiver.inbox.push(mail)
        receiver.save().then(() => {
            User.find({'name':req.session.user}).then((users) => {
                if(! users[0]){
                    return res.status(404).send()
                }
                let user = users[0]
                let mail = {
                    _id: date,
                    other:req.body.receiver,
                    content:req.body.content
                }
                user.send.push(mail)
                user.save().then(
                    res.send({mail})
                )
        })
    })
    }).catch(() => {
        req.status(400).send()
    })
})


// Handles the add mail operation.
router.post("/broadcast", (req, res) => {
    let date = now()
    let mail = {
        _id: date,
        other:req.session.user,
        content:req.body.content
    }
    User.updateMany({}, {
          $push: {"inbox":mail}
    }).then(() => {
        User.find({'name':"admin"}).then((admins) => {
            let admin = admins[0]
            let mail = {
                _id: date,
                other: req.body.receiver,
                content: req.body.content
            }
            admin.send.push(mail)
            admin.save().then(() => {
                let sendback = {
                    "mail":mail,
                    "currentuser": req.session.user
                }
                res.send({mail})
            })
        })
    }).catch(err => {
        res.status(400).send(err)
})
})

// Handles the delete mail operation.
router.delete("/deleteSend", (req, res) => {
    let emailid = req.body.id
    User.find({'name':req.session.user}).then((users) => {
        if(! users[0]){
            return res.status(404).send()
        }
        let user = users[0]
        user.send.id(emailid).remove()
        user.save().then(() => {
            res.send("Eamil deleted from user.send")
        }).catch((error) => {
            res.status(500).send(error)
        })
    })
})


// Handles the delete mail operation.
router.delete("/deleteIn", (req, res) => {
    let emailid = req.body.id
    User.find({'name':req.session.user}).then((users) => {
        if(! users[0]){
            return res.status(404).send()
        }
        let user = users[0]
        user.inbox.id(emailid).remove()
        user.save().then(() => {
            res.send("Eamil deleted from user.send")
        }).catch((error) => {
            res.status(500).send(error)
        })
    })
})

// Function to create an unique id for mails
function now(){
    const date = new Date()
    const  hour = date.getHours()
    const  minute = date.getMinutes()
    const day = date.getUTCDate()
    const month = date.getMonth()
    const year = date.getFullYear()
    return year + "-" + month + "-" + day + " " +  hour + ":" + minute + ":" + date.getSeconds()
}

module.exports = router