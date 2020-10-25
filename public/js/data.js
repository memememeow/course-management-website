/* All hard coded data for phase1. */
class Course {
    constructor(code, section, semester, instructor) {
        this.code = code
        this.name = ""
        this.section = section
        this.semester = semester
        this.instructor = instructor
        this.times = []  // each time slot has form of "DAY START END", DAY is from 0 to 4, START or END is from 08 to 21
        this.students = []
        this.score = 0
        this.location = "TBA"
        this.color = "rgb(0, 0, 0)"
        this.campus = "TBA"
        this.comments = []
        this.intro = ""
    }

    toString() {
        return this.code + " " + this.section + " " + this.semester
    }

    toCode() {
        return this.code + "-" + this.section + "-" + this.semester
    }
}

class User {
    constructor(name, email, password, age) {
        this.name = name
        this.email = email
        this.age = age
        this.programs = []
        this.selfIntro = "N/A"
        this.password = password
        this.courses = [] // array of course objects
        // this.friends = []
        this.comments = []
        this.inbox = []
        this.send = []
        this.privateSchedule = false
    }
}

class Comment {
    constructor(course, user) {
        this.course = course //course code e.g. CSC108
        this.user = user // user object
        this.rate = 0 // integer between 0 and 5
        this.text = ""
    }
}


class Mail {
	constructor(otherEnd, content){
		this.other = otherEnd
		this.content = content
	}

}

const email1 = new Mail("user2", "OSU")
const email2 = new Mail("user3", "WELCOME")
const email3 = new Mail("user4", "THIS IS JUST AN EMAIL")
const email4 = new Mail("user1", "WHAT DATE IS IT TODAY")
const email5 = new Mail("user2", "THANKS")
const email6 = new Mail("Admin", "WAKE UP")

/* Hard code users. */
let user1 = new User("user", "xxxxxxxx@xxxx.com", "user", 20)
let user2 = new User("user2", "xxxxxxxx@xxxx.com", "user2", 10)
let user3 = new User("admin", "xxxx.xxx@xxx.com", "admin", 35)
let user4 = new User("admin2", "xxxx.xxx@xxx.com", "admin2", 105)
user1.inbox = [email1, email2]
user1.send = [email5, email6]

// Hardcode comments
let comment1 = new Comment("CSC108", user1)
comment1.rate = 5
comment1.text = "Good Course! Recommended! aaaaaaaaaaaabchjdbchjdfksckdanskdxldksndcndksbncsb"

let comment2 = new Comment("CSC108", user2)
comment2.rate = 4
comment2.text = "Good Course! Recommended! aaaaaaaaaaaabchjdbchjdfksckdanskdxldksndcndksbncsb"

let comment3 = new Comment("CSC148", user4)
comment3.rate = 4
comment3.text = "Good Course! Recommended! aaaaaaaaaaaabchjdbchjdfksckdanskdxldksndcndksbncsb"

/* Hardcod courses. */
let course1 = new Course("CSC108", "LEC0101", "F", "J Campbell")
course1.name = "Introduction to Computer Programming"
course1.times = ["1 12 14", "3 13 14"]
course1.location = "MY 150"
course1.color = "rgb(200, 105, 0)"
course1.intro = "Programming in a language such as Python. Elementary data types, lists, maps. Program structure: control flow, functions, classes, objects, methods. Algorithms and problem solving. Searching, sorting, and complexity. Unit testing. No prior programming experience required. NOTE: You may not take this course concurrently with CSC120H1/CSC148H1, but you may take CSC148H1 after CSC108H1."
course1.campus = "St. George"
course1.students = [user1, user2, user3]
course1.comments = [comment1, comment2]
course1.score = 4.5

let course2 = new Course("CSC108", "LEC0201", "F", "T Fairgrieve")
course2.name = "Introduction to Computer Programming"
course2.times = ["2 13 15", "4 13 14"]
course2.location = "MY 150"
course2.intro = course1.intro
course2.campus = "St. George"
course2.color = "rgb(200, 105, 0)"
course2.students = [user1, user2, user3]
course2.comments = [comment1, comment2]
course2.score = 4.5

let course3 = new Course("CSC148", "LEC0501", "S", "J Smith")
course3.name = "Introduction to Computer Science"
course3.times = ["2 18 21"]
course3.location = "MY 150"
course3.intro = "Abstract data types and data structures for implementing them. Linked data structures. Encapsulation and information-hiding. Object-oriented programming. Specifications. Analyzing the efficiency of programs. Recursion. This course assumes programming experience as provided by CSC108H1. Students who already have this background may consult the Computer Science Undergraduate Office for advice about skipping CSC108H1."
course3.campus = "St. George"
course3.color = "rgb(100, 150, 100)"
course3.students = [user1, user4]
course3.comments = [comment3]
course3.score = 4

let course4 = new Course("CSC148", "LEC0501", "S", "J Smith")
course4.name = "Introduction to Computer Science"
course4.times = ["2 18 21"]
course4.location = "MY 150"
course4.intro = course3.intro
course4.campus = "St. George"
course4.color = "rgb(100, 150, 100)"
course4.students = [user1, user4]
course4.comments = [comment3]
course4.score = 4

let course5 = new Course("CSC148", "TUT0101", "S", "TBA")
course5.name = "Introduction to Computer Science"
course5.times = ["2 9 11"]
course5.intro = course3.intro
course5.campus = "St. George"
course5.color = "rgb(100, 150, 100)"
course5.students = [user1, user4]
course5.comments = [comment3]
course5.score = 4

let course6 = new Course("MAT131", "LEC0201", "F", "Loream Ipsum")
course6.name = "Calculus"
course6.campus = "Scarborough"
course6.times = ["0 10 11", "2 10 12"]
course6.intro = "A conceptual approach for students with a serious interest in mathematics. Attention is given to computational aspects as well as theoretical foundations and problem solving techniques. Review of Trigonometry. Limits and continuity, mean value theorem, inverse function theorem, differentiation, integration, fundamental theorem of calculus, elementary transcendental functions, Taylor's theorem, sequence and series, power series. Applications."
course6.color = "rgb(0, 105, 200)"
course6.students = [user1, user3, user4]

let course7 = new Course("MAT137", "LEC0201", "S", "Loream Ipsum")
course7.name = "Calculus"
course7.times = ["0 10 11", "2 10 12"]
course7.campus = "St. George"
course7.intro = "A conceptual approach for students with a serious interest in mathematics. Attention is given to computational aspects as well as theoretical foundations and problem solving techniques. Review of Trigonometry. Limits and continuity, mean value theorem, inverse function theorem, differentiation, integration, fundamental theorem of calculus, elementary transcendental functions, Taylor's theorem, sequence and series, power series. Applications."
course7.color = "rgb(200, 0, 105)"

let course8 = new Course("STA246", "LEC0201", "F", "Loream Ipsum")
course8.name = "Statistics for Computer Scientists"
course8.times = ["1 12 13", "4 21 22"]
course8.campus = "Scarborough"
course8.intro = "A survey of statistical methodology with emphasis on data analysis and applications. The topics covered include descriptive statistics, data collection and the design of experiments, univariate and multivariate design, tests of significance and confidence intervals, power, multiple regression and the analysis of variance, and count data. Students learn to use a statistical computer package as part of the course (Note: STA248H1 does not count as a distribution requirement course)."
course8.color = "rgb(105, 0, 200)"

let course9 = new Course("STA248", "LEC0201", "S", "Loream Ipsum")
course9.name = "Statistics for Computer Scientists"
course9.times = ["1 12 13", "4 20 22"]
course9.campus = "St. George"
course9.intro = "A survey of statistical methodology with emphasis on data analysis and applications. The topics covered include descriptive statistics, data collection and the design of experiments, univariate and multivariate design, tests of significance and confidence intervals, power, multiple regression and the analysis of variance, and count data. Students learn to use a statistical computer package as part of the course (Note: STA248H1 does not count as a distribution requirement course)."
course9.color = "rgb(105, 200, 0)"

let allCourses = [course1, course2, course3, course4, course5, course6, course7, course8, course9]

// /* Hard code users. */
// let user1 = new User("user", "xxxxxxxx@xxxx.com", "user", 20)
// let user2 = new User("user2", "xxxxxxxx@xxxx.com", "user2", 10)
// let user3 = new User("admin", "xxxx.xxx@xxx.com", "admin", 35)
// let user4 = new User("admin2", "xxxx.xxx@xxx.com", "admin2", 105)
let allUsers = [user1, user2, user3, user4]

user1.year = 100
user2.year = 24
user3.year = 16
user4.year = 99

user3.inbox = [email1, email2]
user3.send = [email4, email6]
user1.programs = 'ECE'
user2.programs = 'ECE'
user3.programs = 'ECE'
user4.programs = 'CS'

user4.courses = [course1, course2]

user1.selfIntro = "This is a first year math student from uoft!! Looking for partners to join CSC165 next semester."

let allComments = [comment1, comment2, comment3]

/* A function that return a list of hardcoded courses. */
function returnCourses(){
	return allCourses
}

function setCourses(newAllCourses) {
    allCourses = newAllCourses;
}

/* A function that returns a list of hardcoded users. */
function returnUsers(){
	return allUsers
}

function setUsers(newAllUsers) {
    allUsers = newAllUsers;
}

/* A function that returns a list of courses given a course name. */
function returnCourseWithName(courseName){
	let res = []
	for(let i = 0; i < allCourses.length; i ++){
		if((allCourses[i].code).toUpperCase() == (courseName).toUpperCase()){
			res.push(allCourses[i])
		}
	}
	return res
}

function returnComments(){
    return allComments
}

function returnPrograms(){
	return ["CS", "MATH", "ECE", "ECO"]
}

function addComments(user, courseCode, content, rate) {
  newComment = new Comment(courseCode, user);
  newComment.rate = rate;
  newComment.text = content;
  allComments.push(newComment);


  user.comments.push(newComment);
  let count = 0;
  let courseScore = 0;
  for (let i = 0; i < allCourses.length; i++) {
    if (courseCode == allCourses[i].code) {
      count += 1;
      allCourses[i].comments.push(newComment);

      // update score and variable courseScore only if count is 1
      if (count == 1) {
        courseScore = (allCourses[i].score*(allCourses[i].comments.length-1) + rate) / allCourses[i].comments.length;
      }
      allCourses[i].score = courseScore;
    }
  }
}
