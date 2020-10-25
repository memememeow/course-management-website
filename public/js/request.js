// This is a module to send requests.
const log = console.log

const Requests = {
	getMyInfo: getAUser,
    login: userLogin,
	register: registration,
    updateInfo: updateProfile,
    initData: init,
    sendmail: sendMail,
    deletemailInbox: deleteMail,
    deletemailSend: deleteMail,
    broadcast:broadcast,
    getUserInfo: getDisplayUser,
    leaveComment:comment,
    getAllCourse: getCourse,
    getAllUser: getUser,
    getOneCourseInfo: getCourseByCode,
    admindeleteUser: deleteUserByName,
    deleteCourse: deleteCourseByCode,
    addNewCourse: addCourse,
    adminChangeInfo: adminChange
}



function allRequests(){
    return Requests
}


// A function to handel adding comments.
function comment(detail, callback){
    const request = new Request("/course/"  + detail.code + "/" + detail.section + "/" + detail.semester, {
        method: 'post',
        credentials: "same-origin",
        body:JSON.stringify({
            "comment": detail.comment,
            "rate":detail.rate
        }),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
        }
    });
    fetch(request).then((res) => {
        // Handle response we get from the API
        // Usually check the error codes to see what happened
        if (res.status === 200) {
            return res.json()
        } else {
            alert("Cannot add duplicate comments.")
            return
        }
    }).then((res) => {
        if(!res){
            return
        }
        return callback(res.newComment)
    }).catch((error) => {
        console.log(error)
    })
}
function getDisplayUser(url, displayid, callback) {
    const request = new Request(url + "/" + displayid, {
        method: 'get',
        credentials: "same-origin",
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
        }
    });
    fetch(request).then((res) => {
        // Handle response we get from the API
        // Usually check the error codes to see what happened
        if (res.status === 200) {
            return res.json()
        } else {
            alert("Cannot get such user.")
        }
    }).then((res) => {
        // Pass in a list of users into the callback function.
        return callback(res.user)
    }).catch((error) => {
        console.log(error)
    })
}

// A function to send mail to other uses.
function sendMail(newMail, callback){
    const url = "/mailbox/add"
    const request = new Request(url,
        {
            method: 'post',
            credentials: "same-origin",
            body: JSON.stringify(newMail),
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
            }
        });
    fetch(request).then((res) => {
        // Handle response we get from the API
        // Usually check the error codes to see what happened
        if (res.status === 200) {
            return res.json()
        } else {
            alert("No such user.")
        }
    }).then((value) => {
        log("Send mail successfully")
        callback(value.mail)
    }).catch((error) => {
        console.log(error)
    })
}

function deleteMail(id, isIn, callback){
    let url = ""
    if(isIn){
        url = "/mailbox/deleteIn"
    } else {
        url = "/mailbox/deleteSend"
    }
    const request = new Request(url,
        {
            method: 'delete',
            credentials: "same-origin",
            body: JSON.stringify({
                'id':id.split("\n")[0]
            }),
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
            }
        });
    fetch(request).then((res) => {
        // Handle response we get from the API
        // Usually check the error codes to see what happened
        if (res.status === 200) {
            return res
        } else {
            alert("Fail to delete email.")
        }
    }).then(() => {
        callback()
    }).catch((error) => {
        console.log(error)
    })
}

function broadcast(target, callback){
    const url = "/mailbox/broadcast"
    const request = new Request(url,
        {
            method: 'post',
            credentials: "same-origin",
            body: JSON.stringify(target),
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
            }
        });
    fetch(request).then((res) => {
        // Handle response we get from the API
        // Usually check the error codes to see what happened
        if (res.status === 200) {
            return res.json()
        } else {
            log(res)
            alert("Fail to broadcast.")
        }
    }).then((value) => {
        log(value)
        log("Broadcast mail successfully")
        callback(value.mail)
    }).catch((error) => {
        console.log(error)
    })
}

// Send call to init data on server.
function init(){
    const url = "/hardcodeCourse"
    const request = new Request(url,
        {
            method: 'post',

            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
            }
        });
    const requestUser = new Request('/hardcodeUser',
        {
            method: 'post',

            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
            }
        })
    fetch(request).then((res) => {
        // Handle response we get from the API
        // Usually check the error codes to see what happened
        if (res.status === 200) {
           
        } else {
            alert("Fail to login.")
        }
    }).then(() => {
        fetch(requestUser).then(res => {
            log("Success")
        })
    }).catch((error) => {
        console.log(error)
    })
}

// Send GET to server
function userLogin(user){
	const url = "/userlogin"
	const request = new Request(url, 
	{
        method: 'post', 
		body: JSON.stringify(user),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
			'name':user.name,
			'password':user.password 
        }
    });
    fetch(request).then((res) => {
        // Handle response we get from the API
        // Usually check the error codes to see what happened
        if (res.status === 200) {
			window.location.href = "mailbox"
        } else {
			alert("Fail to login.")
        }
    }).catch((error) => {
        console.log(error)
    })
}


// Request function used by registration.
function registration(newUser){
	const url = "/register/create"
	const request = new Request(url, {
        method: 'post',
		credentials: "same-origin",
		body: JSON.stringify({ 
			"name": newUser.name,
			"email":newUser.email,
			"password":newUser.password,
            "year": newUser.year,
            "programs":newUser.programs
		}),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
        }
    });
    fetch(request).then((res) => {
        // Handle response we get from the API
        // Usually check the error codes to see what happened
        if (res.status === 200) {
			return 
        } else {
			alert("Cannot add such user.")
        }
    }).then((res) => {
		window.location.href = "http://localhost:3000/userprofile"
	}).catch((error) => {
        console.log(error)
    })
}




// Send GET to server, returns a user object.
// Get the profile of current user.
function getAUser(url, callback){
	const request = new Request(url, {
        method: 'get',
		credentials: "same-origin",
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
        }
    });
    fetch(request).then((res) => {
        // Handle response we get from the API
        // Usually check the error codes to see what happened
        if (res.status === 200) {
            return res.json()
        } else {
			alert("Cannot get such user.")
        }
    }).then((res) => {
        log(res.user)
		// Pass in a list of users into the callback function.
		return callback(res)
	}).catch((error) => {
        console.log(error)
    })
}

function updateProfile(newUser, callback){
	const url = "/userprofile/update"
	const request = new Request(url, {
        method: 'post',
        credentials: "same-origin",
        body: JSON.stringify({
            "name": newUser.name,
            "email":newUser.email,
            "password":newUser.password,
            "year":newUser.year,
            "program": newUser.program,
            "intro":newUser.intro
        }),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
        }
    });
    fetch(request).then((res) => {
        // Handle response we get from the API
        // Usually check the error codes to see what happened
        if (res.status === 200) {
            return res.json()
			//return res.json()
        } else {
			alert("Failed to updated user")
        }
    }).then((res) => {
        log(res)
        callback(res)
    }).catch((err) => {
        log(err)
    })
}

// return all courses from db
function getCourse(callback){
    const url = "admin/allCourses"
    const request = new Request(url, {
        method: 'get',
        credentials: "same-origin",
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
        }
    });
    fetch(request).then((res) => {
        // Handle response we get from the API
        // Usually check the error codes to see what happened
        if (res.status === 200) {
            return res.json()
        } else {
            alert("Cannot get such user.")
        }
    }).then((res) => {
        // Pass in a list of users into the callback function.
        return callback(res)
    }).catch((error) => {
        console.log(error)
    })
}

// return all courses from db
function getCourseByCode(courseCode, callback){
    const url = "admin/allCourses"
    const request = new Request(url, {
        method: 'get',
        credentials: "same-origin",
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
        }
    });
    fetch(request).then((res) => {
        // Handle response we get from the API
        // Usually check the error codes to see what happened
        if (res.status === 200) {
            return res.json()
        } else {
            alert("Cannot get such user.")
        }
    }).then((res) => {
        return callback(courseCode, res)
    }).catch((error) => {
        console.log(error)
    })
}

// return all users from db
function getUser(callback){
    const url = "admin/allUsers"
    const request = new Request(url, {
        method: 'get',
        credentials: "same-origin",
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
        }
    });
    fetch(request).then((res) => {
        // Handle response we get from the API
        // Usually check the error codes to see what happened
        if (res.status === 200) {
            return res.json()
        } else {
            alert("Cannot get such user.")
        }
    }).then((res) => {
        // Pass in a list of users into the callback function.
        return callback(res)
    }).catch((error) => {
        console.log(error)
    })
}

function deleteUserByName(inputName){
    const url = "admin/user/"+inputName
    const request = new Request(url, {
        method: 'delete',
        credentials: "same-origin",
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
        }
    });
    fetch(request).then((res) => {
        // Handle response we get from the API
        // Usually check the error codes to see what happened
        if (res.status === 200) {
            return res.json()
        } else {
            alert("Cannot get such user.")
        }
    }).then((res) => {
        log(res, " has been deleted from db")
    }).catch((error) => {
        console.log(error)
    })
}


function deleteCourseByCode(inputCode, section, semester){
    const url = "admin/course/"+inputCode+'/'+section+'/'+semester
    const request = new Request(url, {
        method: 'delete',
        credentials: "same-origin",
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
        }
    });
    fetch(request).then((res) => {
        // Handle response we get from the API
        // Usually check the error codes to see what happened
        if (res.status === 200) {
            return res.json()
        } else {
            alert("Cannot get such user.")
        }
    }).then((res) => {
        log(res, " has been deleted from db")
    }).catch((error) => {
        console.log(error)
    })
}

function addCourse(semester, courseCode, courseName,newSecId, newProf, newTime, newLoc, newContent){
    const url = "admin/addCourse"

    const request = new Request(url, {
        method: 'post',
        credentials: "same-origin",
        body:JSON.stringify({
            courseCode: courseCode,
            semester: semester,
            name:courseName,
            times:newTime, // "1-9-10 2-14-16"

            intro:newContent,
            section:newSecId,
            location:newLoc,
            Instructor:newProf
        }),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
        }
    });

    fetch(request).then((res) => {
        // Handle response we get from the API
        // Usually check the error codes to see what happened
        if (res.status === 200) {
            return res.json()
        } else {
            alert("Cannot get such user.")
        }
    }).then((res) => {

    }).catch((error) => {
        console.log(error)
    })
}

function adminChange(name) {
    const url = "/admin/changeinfo/"+name
    const request = new Request(url, {
        method: 'get',
        credentials: "same-origin",

        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
        }
    });


    fetch(request).then((res) => {

    }).catch((error) => {
        console.log(error)
    })
}