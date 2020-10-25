/* No server side code will be added in this file. */

/* Hard coded data */
const user = returnUsers()[3]
const RequestModel = allRequests()

const submitButton = document.querySelector(".submitProfile")
submitButton.addEventListener("click", e => {updateUser(e)})


/* Update page using info from user*/
RequestModel.getMyInfo('/userprofile/mypage', updateView)


function updateView(res){
	let user = res.user[0]
	const name = document.querySelectorAll("#name")
	const email = document.querySelector('#email')
	const program = document.querySelectorAll('#program')
	const year = document.querySelector('#year')
	const intro = document.querySelector('#intro')
    if(res.currentuser === "admin") {
        $("#adminModel").parent().removeClass("d-none")
    } else {
        $("#adminModel").parent().addClass("d-none")
    }
	for(let i =0; i< name.length; i++){
	    name[i].innerHTML = null
        name[i].appendChild(document.createTextNode(user.name))
    }
    email.innerHTML = null
	email.appendChild(document.createTextNode(user.email))
    for(let i =0; i< name.length; i++){
	    program[i].innerHTML = null
        program[i].appendChild(document.createTextNode(user.programs))
    }
    year.innerHTML = null
	year.appendChild(document.createTextNode(user.year))
    intro.innerHTML = null
	intro.appendChild(document.createTextNode(user.selfIntro))

    const workload = document.querySelector('#workload')
    // workload.innerText = null
    workload.innerText = user.courses.length + " courses."
    const courses = document.querySelector('#userTakingCourse')
    courses.innerHTML = null
    for(let i =0; i< user.courses.length; i++){
	    let course = user.courses[i]
        courses.innerHTML += "<span>" + course.code+"</span><br/>"
    }
    addCourse(user)
}

const courseTable = document.querySelector('#courseTable')
const days = {1:"Monday", 2:"Tuesday", 3:"Wednesday", 4:"Thursday", 5:"Friday"}


/* 
 * A helper function help convert course.time into readable text 
 */
function convertTime(times){
    let res = ""
    for (let i = 0; i < times.length; i ++){
        let time = times[i]
        let specific = time.split("-")
        day = parseInt(specific[0])
        res += "<span class='time'>" + days[day] + " " + specific[1] + ":00 - "
        res += specific[2] + ":00" + "</span><br>"

    }
    return res
}

/*
 * A function that fills up the course table using the course from user.
 */
function addCourse(user){
    while(courseTable.children.length != 1){
        courseTable.removeChild(courseTable.children[1])
    }
    for(let i =0; i < user.courses.length; i++){
        let course = user.courses[i]
        let courseContent = document.createElement('tr')
        let inner = '<th> ' + course.code + ' </th>'
        inner += '<th> ' + course.section + ' </th>'
        inner += '<th> ' + convertTime(course.times) + ' </th>'
        inner += '<th> ' + course.location + ' </th>'
        inner += '<th> ' + course.Instructor + ' </th>'
        courseContent.innerHTML = inner
        courseTable.appendChild(courseContent)
    }
}

/*
 * Update the personal info of a user.
 */
// TODO: Update profile info
function updateUser(e){
    e.preventDefault()
    const user = {}
    const email = $('#userInputEmail')[0]
    const programs = $('#userInputProgram')[0]
    const age = $('#userInputYear')[0]
    const pwd =$('#userInputPassword')[0]
    const pwdd = $('#userInputPasswordConfirm')[0]
    const intro =$('#userInputIntro')[0]
    if(pwd.value){
        user.password = pwd.value
    }
    if(!validEmail(email)){
        alert("Please type in valid email")
        return
    }
    if(email.value) {
        user.email = email.value
    }
    if(pwd !== pwdd && (pwd.value || pwdd.value)){
        alert('Please recheck your type in password')
        return
    }

    if(programs.length !== 0) {
        user.program = programs.value
    }
    if(!validInt(age.value)){
        alert("Please type in valid year")
        user.year = undefined
    } else if(age.value){
        user.year = age.value
    } else {
        user.year = undefined
    }
    if(intro.value) {
        user.intro = intro.value
    }
    // Will need to update list of users in the server.
    // Server side code will be implemented in phase2.
    RequestModel.updateInfo(user, updateView)
}

function validEmail(email) {
    return !/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(email)
}

function validInt(value){
    var re = /[0-9]*/
    return re.test(value)
}
