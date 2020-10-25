const express = require('express');
const router = express.Router();
const log = console.log
const { User } = require('../models/user.js')
const {Courses }= require('../models/course.js');

// Index page
router.get('/', (req, res) => {
	req.session.user='admin'
	if(!req.session.user){
	    res.redirect('/')
	} else {
		res.render('adminView')
	}
});

// Index page
router.get('/changeinfo/:name', (req, res) => {
	// req.session.user= ;
	req.session.display=req.params.name;
	res.send("Session display set.")
});

router.get('/changeinfo', (req, res) => {
	if(!req.session.user){
		res.redirect('/')
	} else {
		if(req.session.display !== req.session.user){
			req.session.display = req.session.user
		}
		res.render('changeinfo')
	}
})

// get information of a course
router.get('/:courseCode/:semester', (req, res) => {
	let courseCode = req.params.courseCode;
	courseCode.toUpperCase();
	let semesterLetter = req.params.semester;
	semesterLetter.toUpperCase();

	let condition = {"code":courseCode, "semester": semesterLetter};

	Courses.find(condition).then((course)=>{
		if (!course){
			res.status(404).send();
		}
		res.send({course});
	}).catch((error) => {
		res.status(400).send(error);
	});
});

// get all courses
router.get('/allCourses', (req, res) => {
	Courses.find().then((course)=>{
		if (!course){
			res.status(404).send();
		}
		res.send({course});
	}).catch((error) => {
		res.status(400).send(error);
	});
});

// get all user
router.get('/allUsers', (req, res) => {
	User.find().then((user)=>{
		if (!user){
			res.status(404).send();
		}
		res.send({user});
	}).catch((error) => {
		res.status(400).send(error);
	});
});


// get information of a course
//body {:courseCode/:semester/:name/:times/:intro/:section/:location/:Instructor
// }
router.post('/addCourse', (req, res) => {
	let courseCode = req.body.courseCode;
	let semesterLetter = req.body.semester;
	let name = req.body.name;
	let times = req.body.times.split(" "); // "1-9-10 2-14-16"

	let intro = req.body.intro;
	let section = req.body.section;
	let location = req.body.location;
	let instructor = req.body.Instructor;

	function getRandomColor() {
		let letters = '0123456789ABCDEF';
		let color = '#';
		for (let i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	}

	let newCourse = new Courses({
		code: courseCode,
		name: name,
		semester: semesterLetter,
		score: 5,
		times: times,
		students: [],
		comments: [],
		intro: intro,
		color: getRandomColor(),
		section: section,
		location: location,
		Instructor: instructor
	});

	newCourse.save().then((course) => {
		res.send(course)
	}, (error) => {
		res.status(400).send(error) // 400 for bad request
	})
});


router.delete('/user/:name', (req, res) => {
	let userName = req.params.name;

	User.findOneAndDelete({'name': userName}).then((user) =>{
		if(!user) {
			res.status(404).send()
		} else{
			for (let i =0; i<user.courses.length; i++){
				let courseCode = user.courses[i].code;
				let courseSemester = user.courses[i].semester;
				let courseSec = user.courses[i].section;
				Courses.findOne({code:courseCode, semester:courseSemester, section:courseSec}).then((course)=>{
					let updatedVal = course.students.filter((usrName)=> usrName !== userName)
					Courses.updateOne({code:courseCode, semester:courseSemester, section:courseSec},{students:updatedVal}).then((course)=>{
					}).catch((error) =>{
						res.status(400).send(error)
					})
				}).catch((error) =>{
					res.status(400).send(error)
				})
			}
			res.send({ user })
		}
	}).catch((error) =>{
		res.status(400).send(error)
	})
});

router.delete('/course/:code/:section/:semester', (req, res) => {
	let courseCode = req.params.code;
	let semester = req.params.semester;
	let sec = req.params.section;

	Courses.findOneAndDelete({code: courseCode, semester: semester, section: sec}).then((course) =>{
		if(!course) {
			res.status(404).send()
		} else{
			for (let i =0; i<course.students.length; i++){
				let enrolledPpl = course.students[i];
				User.findOne({name:enrolledPpl}).then((user)=>{
					let updatedVal = user.courses.filter((courseObj)=> courseObj.code !== courseCode && courseObj.semester !== semester && courseObj.section !== sec)
					User.updateOne({name:enrolledPpl},{courses:updatedVal}).then((updatedUser)=>{
					}).catch((error) =>{
						res.status(400).send(error)
					})
				}).catch((error) =>{
					res.status(400).send(error)
				})
			}
			res.send({ course })
		}
	}).catch((error) =>{
		res.status(400).send(error)
	})
});

module.exports = router;