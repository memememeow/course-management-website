/* CSC309 - user and resource authentication */

'use strict';
const log = console.log;

// load modules
const express = require('express')
const port = process.env.PORT || 3000
const bodyParser = require('body-parser') // middleware for parsing HTTP body from client
const session = require('express-session')
const hbs = require('hbs')

const { ObjectID } = require('mongodb')

// Import our mongoose connection
const { mongoose } = require('./db/mongoose');

// express
const app = express();
const router = express.Router()

// Import the models
const { Courses } = require('./models/course.js')
const { User } = require('./models/user.js')
const path = require('path')

//set public path, views path and partial parth
const publicPath = "./public/"
const viewsPath = "./templates/views/"
const partialsPath = "./templates/partials/"
app.set("view engine", "hbs")
app.set("views", viewsPath)
app.use(express.static(publicPath))
hbs.registerPartials(partialsPath)

const loginRouter = require('./route/loginRouter.js')
const indexRouter = require("./route/indexRouter.js")
const mailboxRouter = require("./route/mailboxRouter.js")
const profileRouter = require("./route/userprofileRouter.js")
const adminviewRouter = require('./route/adminViewRouter.js')
const registerRouter = require('./route/registerRouter.js')
const courseRouter = require('./route/courseRouter.js')

// body-parser middleware setup.  Will parse the JSON and convert to object
app.use(bodyParser.json());
// parse incoming parameters to req.body
app.use(bodyParser.urlencoded({ extended:true }))

app.use(session({
    cookie: {
        maxAge:30 * 60 * 1000,
        httpOnly: true
    },
    rolling: true,
    resave: true,
    saveUninitialized: true,
    secret: '~~~~~'
}));

// Middleware used for every request.
const checker = ((req, res, next) => {
	if(! req.session.user){
		return res.render('login')
	} else {
		req.user = req.session.user
		next()
	}
})

// Handler for user accessing user data.
app.use('/', loginRouter)
app.use("/register", registerRouter)
// Feature handler routers.
app.use("/index",  checker, indexRouter)
app.use("/mailbox",  checker, mailboxRouter)
app.use("/course", checker, courseRouter)
app.use('/userprofile', checker, profileRouter)
// Router handling admin operations.
app.use('/admin',  checker, adminviewRouter)

// Log out handler.
app.get('/logout', (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            res.status(500).send(error)
        } else {
            res.redirect('/')
        }
    })
})

app.get('/changeDisplay', (req, res) => {
    log("Change display back to regular user.")
    req.session.display = req.session.user
    res.redirect("/userprofile")
})


// Hard code data handler.
app.post("/hardcodeUser", (req, res) => {

    const user1 = new User({
        coureses: [],
        name: "user",
        password: "user",
        selfIntro: "Hello, I am user 1!",
        programs: 'CS',
        year: 10,
        privateSchedule: 0,
        inbox: [],
        send: [],
        email: "user@email.com"
    })
    user1.courses.push({
        code: "MAT137",
        name: "Calculus",
        semester: "S",
        score: 2,
        times: ["3-13-16", "4-9-10"],
        students: ["user"],
        comments: [{_id: "user",rate: 5.0, content: "Memorize formulas"}],
        intro: "This is a fake introduction",
        color: "blue",
        section: "LEC0201",
        location: "SF1101",
        Instructor: "Alfonso"
    })
    user1.courses.push({
        code: "CSC108",
        name: "Intro to Programming",
        semester: "F",
        score: 4,
        times: ["1-13-16", "2-9-10"],
        students: ["user"],
        comments: [	{_id: "user",rate: 3.0, content: "Too much coding"}],
        intro: "This is a fake introduction",
        color: "red",
        section: "LEC0101",
        location: "BA1170",
        Instructor: "David"
    })
    user1.save();


    const user2 = new User({
        name: "admin",
        password: "admin",
        selfIntro: "Hello, I am admin!!!",
        programs: "MATH",
        year: 19,
        privateSchedule: 0,
        inbox: [],
        send: [],
        email: "admin@gmail.com",
        isAdmin: true
    })
    user2.save();
    res.send([user1, user2])
});

app.post("/hardcodeCourse", (req, res) => {
	const course1 = new Courses({
        code: "CSC108",
        name: "Intro to Programming",
        semester: "F",
        score: 3.0,
        times: ["1-13-16", "2-9-10"],
        students: ["user"],
        comments: [],
        intro: "This is a fake introduction",
        color: "red",
        section: "LEC0101",
        location: "BA1170",
        Instructor: "David"
    })
    course1.comments.push({_id: "user",rate: 3.0, content: "Too much coding"})
    course1.save();


    const course2 = new Courses({
        code: "MAT137",
        name: "Calculus",
        semester: "S",
        score: 5,
        times: ["3-13-16", "4-9-10"],
        students: ["user"],
        comments: [],
        intro: "This is a fake introduction",
        color: "blue",
        section: "LEC0201",
        location: "SF1101",
        Instructor: "Alfonso"
    })
    course2.comments.push({_id: "user",rate: 5.0, content: "Memorize formulas"})
    course2.save();

    const course3 = new Courses({
        code: "STA257",
        name: "Statistics",
        semester: "F",
        score: 5,
        times: ["1-9-10", "5-9-12"],
        students: [],
        comments: [],
        intro: "This is a fake introduction",
        color: "orange",
        section: "LEC5201",
        location: "SS2195",
        Instructor: "Shivon"
    })
    course3.save();

    const course4 = new Courses({
        code: "PSY100",
        name: "Introduction to psychology",
        semester: "F",
        score: 2.0,
        times: ["3-16-17", "4-12-13"],
        students: [],
        comments: [	],
        intro: "This course is first year introductory course to psychology",
        color: "green",
        section: "LEC0201",
        location: "WWB521",
        Instructor: "Wendy"
    })
    course4.comments.push({_id: "user",rate: 2.0, content: "I do not like memorization"})
    course4.save();

    const course5 = new Courses({
        code: "ECE380",
        name: "Operating systems",
        semester: "S",
        score: 5,
        times: ["5-18-21"],
        students: [],
        comments: [],
        intro: "This is engineering version of operating system course, focus on low level design of OS.",
        color: "pink",
        section: "LEC5501",
        location: "SF3203",
        Instructor: "Bogdan Simion"
    })
    course5.save();

    const course6 = new Courses({
        code: "CSC431",
        name: "Deep learning",
        semester: "S",
        score: 1,
        times: ["4-18-21"],
        students: [],
        comments: [],
        intro: "This course focus on neural nets and GAN models.",
        color: "#A326AB",
        section: "LEC5501",
        location: "SF3203",
        Instructor: "Bogdan Simion"
    })
    course6.comments.push({_id: "admin", rate: 1, content: "Good course, good course, good course"})
    course6.save();

    res.send([course1, course2, course3, course4, course5, course6])

})


app.listen(port, () => {
	log(`Listening on port ${port}...`)
});
