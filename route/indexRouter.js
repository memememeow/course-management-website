const express = require('express');
const app = express()
const router = express.Router();
const {Courses} = require("../models/course.js")
const {User} = require("../models/user.js")
const log = console.log

app.use(express.json())


router.get("/", (req, res) => {
    if(!req.session.user) {
        res.redirect("login")
        return log("Index Not logged in")
    }
    res.render("index")
})

router.get("/profile", (req, res) => {
    const {user} = req.params
    req.session.display = user
    res.render("/userprofile")
})

router.get("/allusers", (req, res) => {
    User.find({}).then((users) => {
        res.send({users})
    }).catch((error) => {
        res.status(404).send(error)
    })
})

router.get("/allcourses", (req, res) => {
    Courses.find({}).then((courses) => {
        res.send({courses})
    }).catch((error) => {
        res.status(404).send(error)
    })
})

//handle displaying all courses on timetable
router.get("/loadinfo", (req, res) => {
    if(!req.session.user) {
        res.render("login")
        return log("Not logged in")        
    }
    if(req.session.display !== req.session.user){
        req.session.display = req.session.user
    }
    User.find({"name": req.session.user}).then((users) => {
        if(users.length === 0) {
            return res.status(404).send()
        }
        const user = users[0]
        res.send({user})
    }).catch((error) => {
        return res.status(500).send(error)
    })
})

// handle adding course
router.post("/add", (req, res) => {
    if(!req.session.user) {
        res.render("login")
        return log("Add : Not logged in")        
    }
    if(req.session.display !== req.session.user){
        req.session.display = req.session.user
    }
    const {code, section, semester} = req.body
    // let targetCourse = null
    Courses.find({"code": code, "section": section, "semester": semester}).then((courses) => {
        if(courses.length === 0) {
            return res.status(404).send()
        }
        const targetCourse = courses[0]

        User.find({"name": req.session.user}).then((users) => {
            if(users.length === 0) {
                return res.status(404).send()
            }
            const user = users[0]
            user.courses.push(JSON.parse(JSON.stringify(targetCourse)))
            // user.courses.push(targetCourse)
            targetCourse.students.push(user.name)
            user.save().then((result1) => {
                targetCourse.save().then((result2) => {
                    res.send({
                        targetCourse,
                        user
                    })
                }).catch((error) => {
                    return res.status(400).send(error)
                })
            }).catch((error) => {
                return res.status(400).send(error)
            })
        
        }).catch((error) => {
            return res.status(500).send(error)
        })
    }).catch((error) => {
        return res.status(500).send(error)
    })
})

//handle removing course
router.delete("/remove", (req, res) => {
    if(!req.session.user) {
        res.render("login")
        return log("Remove: Not logged in")
    }
    if(req.session.display !== req.session.user){
        req.session.display = req.session.user
    }
    const userName = req.session.user
    const {code, section, semester} = req.body
	User.findOne({'name': userName}).then((user) =>{
		if(!user) {
			return res.status(404).send()
		} else{
            Courses.findOne({"code": code, "section":section, "semester":semester}).then((course) => {
                if(!course) {
                    return res.status(404).send()
                } else {
                    let newCourses = user.courses.filter((c) => {
                        return c.code !== code || c.section !== section || c.semester !== semester
                    })

                    let newStudents = course.students.filter((s) => {
                        return s !== user.name
                    })


                    User.updateOne({'name': user.name}, {courses: newCourses}).then((user) => {
                        Courses.updateOne({"code": code, "section":section, "semester":semester}, {students: newStudents}).then((course) => {
                            res.status(200).send()
                        }).catch((error) => {
                            return res.status(400).send(error)
                        })
                    }).catch((error) => {
                        return res.status(400).send(error)
                    })
                }
            }).catch((error) => {
                res.status(400).send(error)
            })
		}
	}).catch((error) =>{
		res.status(400).send(error)
	})
})



module.exports = router