const express = require('express');
const app = express()
const router = express.Router();
const {Courses} = require("../models/course.js")

app.use(express.json())

router.get("/:code/:section/:semester", (req, res) => {
    const {code, section, semester} = req.params
    Courses.find({code, section, semester}).then((courses) => {
        if(courses.length === 0) {
            return res.status(404).send()
        }
        const course = courses[0]
        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
        //generate all time slots
        let timeList = "<ul>"
        course.times.forEach((time) => {
            const dayStartEnd = time.split("-")
            timeList += "<li>" + days[Number(dayStartEnd[0])-1]  + " " + dayStartEnd[1] + ":00" + " - " + dayStartEnd[2]
               + ":00 " + "</li>"
        })
        timeList += "</ul>"
        //generate all comments
        let commentList = ""
        const comments = course.comments
        comments.forEach((comment) => {
            commentList += "<div class='comment'><div class='commenter'>" +
                "<a href='#aboutModal' data-toggle='modal' data-target='#myModal' class='showUsers'>" +
                comment._id +"</a></div><div class='ratingStars'>"
            for(let i = 0; i < comment.rate; i++){
                commentList +=  "<span class='fa fa-star fa-lg checked'></span>"
            }
            for(let i = comment.rate; i < 5; i++){
                commentList += "<span class='fa fa-star fa-lg'></span>"
            }
            commentList += "</div>" +"<div class='commentConstant'>" + comment.content +"</div>" + "</div>"
        })

        //generate all friends
        let friendList = "<ul id='friendList'>"
        course.students.forEach((student) => {
            friendList +=
                "<li class='friend'>"  +
                "<img src='/img/profileImg.png' class='friendImg'><a href='#aboutModal' data-toggle='modal' data-target='#myModal' class='showUsers'>"
                + student + "</a></li>"
        })
        friendList += "</ul>"
        return res.render("course", {
            code: course.code,
            name: course.name,
            semester: course.semester,
            description: course.intro,
            times: timeList,
            comments: commentList,
            friends: friendList,
            section: course.section,
            courserate: parseFloat(course.score).toFixed(3),
            totallength: course.comments.length
        })

    }).catch((error) => {
        res.status(500).send()
    })
})

router.post("/:code/:section/:semester", (req, res) => {

    const {code, section, semester} = req.params
    Courses.find({code, section, semester}).then((courses) => {
        if(courses.length === 0) {
            return res.status(404).send()
        }
        if (courses[0].comments.id(req.session.user)){
            return res.status(403).send()// Cannot add duplicate comments.
        }
        let updatedCourse = courses[0]
        updatedCourse.score = (courses[0].score * (courses[0].comments.length) + req.body.rate)/(courses[0].comments.length + 1)
        let newComment = {
            _id: req.session.user,
            content: req.body.comment,
            rate: req.body.rate
        }
        updatedCourse.comments.push(newComment)
        newComment.length = updatedCourse.comments.length
        newComment.rate = updatedCourse.score
        updatedCourse.save().then(() => {
            res.send({newComment})
        }).catch((error) => {
            res.status(500).send(error)
        })
    })
})


module.exports = router