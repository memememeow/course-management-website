// Selected courses pulled from database.
const selectedCourses = []
const RequestModel = allRequests()
// Interactive functions.
const searchUser = $("#searchUser")
const searchCourse = $("#searchCourse")
const searchCourseWrapper = $("#searchCourseWrapper")

const toCode = function(course) {
    return course.code + "-" + course.section + "-" + course.semester
}

const toString = function(course) {
    return course.code + " " + course.section + " " + course.semester
}


$("#adminModel").click(function(e) {
    e.preventDefault()
    const request = new Request("/admin",{
        method: "get",
        credentials: "same-origin",
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
        }
    })
    fetch(request).then((res) => {
        if(res.status === 200) {
            window.location.href = "/admin"
        } else {
            log("failed to jump to admin")
        }
    }).catch((error)=> {
        log(error)
    })
})

/// BACKEND PART//////
window.onload = function() {
    //log("LOADED!")
    url = "/index/loadinfo"
    reloadRequest = new Request(url, {
        method: "get",
        credentials: "same-origin",
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
        }
    })
    // let currUser = null
    fetch(reloadRequest).then((res) => {
        if (res.status === 200) {
            return res.json()
        } else {
            alert("Cannot get such user.")
        }
    }).then((res) => {
        // Pass in a list of users into the callback function.
        let currUser = res.user
        if(currUser != null) {
            log("The user who logged in is ------> ", currUser)
            while(selectedCourses.length > 0) {
                selectedCourses.pop()
            }
            const courses = currUser.courses
            courses.forEach((course) => {
                log(course)
                // const times = course.times
                // const courseName = course.code + " " + course.section + " " + course.semester
                scheduleCourse(course)
                // selectedCourses.push(course)
            })
            //show admin model button if the user is an admin
            if(currUser.isAdmin) {
                $("#adminModel").parent().removeClass("d-none")
            } else {
                $("#adminModel").parent().addClass("d-none")
            }
        }
    }).catch((error) => {
        log(error)
        alert("Fail to load user's information")
    })

}

// shift to another view
const jumpTo = function(page) {
    const url = page
    const request = new Request(url, {
        method: 'get',
        // body: JSON.stringify(user),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        }
    })
    fetch(request).then((res) => {
    }).catch((error) => {
    })
}

/// BACKEND PART//////

// create the drop down menu under the icon
const createDropDownMenu = function() {
    let menuWrapper = $("<div></div>").css({
        "width":"150px",
        "class" : "d-inline"
    }).attr("id", "menuWrapper")
    let listGroup = $("<ul></ul>").attr({
        class: "list-group"
    })
    listGroup.append("<li class='list-group-item' id='viewProfile'>View Profile</li>")
    listGroup.append("<li class='list-group-item' id='editPassword'>Edit Password</li>")
    listGroup.append("<li class='list-group-item' id='editProfile'>Edit Profile</li>")

    listGroup.children().on("mouseenter", function(){
        $(this).addClass("bg-info")
    })
    listGroup.children().on("mouseleave", function(){
        $(this).removeClass("bg-info")
    })

    // listGroup.find("#viewProfile").click(function() {
    //     jumpTo("userprofile.html")
    // })

    // listGroup.find("#editPassword").click(function() {
    //     jumpTo("changepassword.html")
    // })

    // listGroup.find("#editProfile").click(function() {
    //     jumpTo("changeinfo.html")
    // })


    let position = $("#profileImage").offset()
    menuWrapper.css({
        "position": "fixed",
        "left" : String(position.left - 40) + "px",
        // "top" : String(position.top + Number($("#profileImage").css("height").split("px")[0])) + "px"
        "top" : "130px"
    })
    menuWrapper.append(listGroup)
    $("body").append(menuWrapper)
}


// check whether two time slots conflict
const conflict = function(stamp1, stamp2) {
    let dayStartEnd1 = stamp1.split("-")
    let dayStartEnd2 = stamp2.split("-")
    let day1 = Number(dayStartEnd1[0])
    let day2 = Number(dayStartEnd2[0])
    if(day1 != day2) {
        return false
    }
    let start1 = Number(dayStartEnd1[1])
    let start2 = Number(dayStartEnd2[1])
    let end1 = Number(dayStartEnd1[2])
    let end2 = Number(dayStartEnd2[2])
    return Math.max(start1, start2) < Math.min(end1, end2)
}

/*
 * Add a selected course from website. Might need interaction with server to update current user's courses.
 */
const addToTimeTable = function(course, slot) {
    let courseName = toString(course)
    let dayStartEnd = slot.split("-")
    let day = Number(dayStartEnd[0])
    let start = Number(dayStartEnd[1])
    let end = Number(dayStartEnd[2])

    // add time slot onto the timetable
    let row = $("#" + String(start) + courseName.split(" ")[2])
    let cell = $(row.children()[day])
    let newBlock = $("<div></div>")
    newBlock.addClass(toCode(course))
    newBlock.addClass("text-white")
    newBlock.addClass("d-inline")
    newBlock.text(courseName);
    newBlock.css("background-color", course.color)
    newBlock.css("position", "absolute");
    newBlock.css("width", cell.css("width"))
    let position =  cell.offset()
    //log("Position:", position)
    newBlock.css("left", String(position.left) + "px")
    newBlock.css("top", String(position.top) + "px")
    let newHeight = Number(cell.css("height").split("px")[0])
    newBlock.css("height", String((end-start)*newHeight) + "px")
    $("body").append(newBlock);
}

// increase work load of one semester
const incrementWorkLoad = function(semester) {
    let display = $("#workload" + semester).text()
    let newDisplay = "Work Load: " + String(Number(display.split(" ")[2]) + 0.5)
    $("#workload" + semester).text(newDisplay)
}

// decrease work load of one semester
const reduceWorkLoad = function(semester) {
    let display = $("#workload" + semester).text()
    let newDisplay = "Work Load: " + String(Math.max(0, Number(display.split(" ")[2]) - 0.5))
    $("#workload" + semester).text(newDisplay)
}

const scheduleCourse = function(course) {
    // add course to the course list

    if($("." + toCode(course)).length > 0) {
        return;
    }

    // handle conflict
    for(let sc in selectedCourses) {
        for(let i in selectedCourses[sc].times) {
            for(let j in course.times) {
                if(course.semester != selectedCourses[sc].semester)
                    continue;
                let time1 = selectedCourses[sc].times[i]
                let time2 = course.times[j]
                if(conflict(time1, time2)) {
                    log("Comparing", time1, time2)
                    alert(toCode(course) + " conflicts with " + toCode(selectedCourses[sc]))
                    return;
                }
            }
        }
    }

    let courseList = $("#courseList");

    let newCourse = $("<a href='#' class='list-group-item list-group-item-action text-white'></a>");
    newCourse.addClass(toCode(course))
    newCourse.text(toString(course))
    newCourse.append(createRemoveCourseButton(course))
    newCourse.css("background-color", course.color)
    // newCourse.addClass("text-white")
    newCourse.on("click", function(e) {
        e.preventDefault()
        const url = "/course/" + course.code + "/" + course.section + "/" + course.semester
        const courseInfoRequest = new Request(url, {
            method: 'get',
            credentials: "same-origin",
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            }
        })
        fetch(courseInfoRequest).then((res) => {
            window.location.href = url
        }).catch((error) => {
            log(error)
        })
    })
    if(course.semester === "F") {
        newCourse.addClass("list-group-item-success")
    } else if(course.semester === "S") {
        newCourse.addClass("list-group-item-warning")
    } else {
        newCourse.addClass("list-group-item-info")
    }
    courseList.append(newCourse)


    // put course in the timetable
    let slots = course.times
    slots.forEach(function(s) {
        addToTimeTable(course, s)
    })

    // update course load
    if(course.semester === "F") {
        let alreadyAdded = false
        for(let i = 0; i < selectedCourses.length; i++) {
            if(selectedCourses[i].semester === "F" && selectedCourses[i].code === course.code) {
                alreadyAdded = true
            }
        }
        if(!alreadyAdded) {
            incrementWorkLoad("F")
        }
    } else if(course.semester === "S") {
        let alreadyAdded = false
        for(let i = 0; i < selectedCourses.length; i++) {
            if(selectedCourses[i].semester === "S" && selectedCourses[i].code === course.code) {
                alreadyAdded = true
            }
        }
        if(!alreadyAdded) {
            incrementWorkLoad("S")
        }
    }


    // simulate a server call which updates the user's information
    selectedCourses.push(course)
}

const checkDuplicateCourse = function(course) {
    let duplicate = false
    selectedCourses.forEach((element) => {
        if(element.code === course.code && element.section === course.section && element.semester === course.semester)
            duplicate = true
    })
    return duplicate
}

const createAddCourseButton = function(course) {
    let addButton = $("<button class='btn btn-success'>Add</button>")
    addButton.css("margin-left", "5px");
    addButton.on("click", function(e) {
        e.preventDefault()
        //prevent adding duplicate courses
        if(checkDuplicateCourse(course) === true) {
            return
        }
        // handle conflict with previously added courses
        for(let sc in selectedCourses) {
            for(let i in selectedCourses[sc].times) {
                for(let j in course.times) {
                    if(course.semester != selectedCourses[sc].semester)
                        continue;
                    let time1 = selectedCourses[sc].times[i]
                    let time2 = course.times[j]
                    if(conflict(time1, time2)) {
                        log("Comparing", time1, time2)
                        alert(toCode(course) + " conflicts with " + toCode(selectedCourses[sc]))
                        return;
                    }
                }
            }
        }
        scheduleCourse(course)
        const url = "/index/add"
        const addRequest = new Request(url, {
            method: 'post',
            credentials: "same-origin",
            body: JSON.stringify({
                "code": course.code,
                "section": course.section,
                "semester": course.semester
            }),
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
            }
        });
        fetch(addRequest).then((res) => {
            if(res.status === 200) {
                return res.json()
            }
            else {
                alert("Failed to add a course")
            }
        }).then((res) => {

        }).catch((error) => {
            alert("Failed to add a course")
        })
    })
    return addButton
}

function addCourseToUser(course) {
    scheduleCourse(course)
    const url = "/index/add"
    const addRequest = new Request(url, {
        method: 'post',
        credentials: "same-origin",
        body: JSON.stringify({
            "code": course.code,
            "section": course.section,
            "semester": course.semester
        }),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
        }
    });
    fetch(addRequest).then((res) => {
        if(res.status === 200) {
            return res.json()
        }
        else {
            alert("Failed to add a course")
        }
    }).then((res) => {
    }).catch((error) => {
        alert("Failed to add a course")
    })
}

const createRemoveCourseButton = function(course) {
    let removeButton = $("<button class='btn btn-danger'>Remove</button>")
    removeButton.css("margin-left", "5px");
    removeButton.on("click", function(e){
        e.preventDefault()
        $("." + toCode(course)).remove()
        if($("#courseList").children().length === 0) {
            $("#description").empty()
        }

        // remove course from the local selectedCourses array
        let N = selectedCourses.length
        for(let i = 0; i < N; i++) {
            if(toString(selectedCourses[i]) === toString(course)) {
                let temp = selectedCourses[i]
                selectedCourses[i]  = selectedCourses[N-1]
                selectedCourses[N-1] = temp
                selectedCourses.pop()
                // updateUserCallBack(selectedCourses)
                break;
            }
        }
        N = selectedCourses.length
        let totallyRemoved = true;
        for(let i = 0; i < N; i++) {
            if(selectedCourses[i].code === course.code && selectedCourses[i].semester === course.semester && selectedCourses[i].section === course.section) {
                totallyRemoved = false
                break;
            }
        }


        if(totallyRemoved === true) {
            //reduce work load
            reduceWorkLoad(course.semester)
        }

        // remove course from server
        const url = "/index/remove"
        // more server side code would be implemented to update the user's data
        const removeRequest = new Request(url, {
            method: 'delete',
            credentials: "same-origin",
            body: JSON.stringify({
                "code": course.code,
                "section": course.section,
                "semester": course.semester
            }),
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
            }
        });
        fetch(removeRequest).then((res) => {
        }).catch((error) => {
            alert("Failed to remove a course")
        })
    })
    return removeButton
}

const createCourseInfoButton = function(course) {
    let removeButton = $("<button class='btn btn-info'>Info</button>")
    removeButton.css("margin-left", "5px");  
    removeButton.click(function(e) {
        const url = "/course/" + course.code + "/" + course.section + "/" + course.semester
        const infoRequest = new Request(url, {
            method: 'get',
            credentials: "same-origin",
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
            }
        })
        fetch(infoRequest).then((res) => {
            // document.write(res)
            if(res.status === 200) {
                window.location.href = url
            } else {
                alert("Failed to load course information")
            }
        }).catch((error) => {
            alert("Failed to load course information")
        })
    })
    return removeButton
}

const createMatchedCourseList = function(currInput, id, data) {
    let currInputLen = currInput.length
    let newList = $("<ul class='list-group'></ul>")
    newList.attr("id", id)
    for(let i = 0; i < data.length; i++) {
        if(data[i].code.substring(0, currInputLen) === currInput) {
            let newItem = $("<li class='list-group-item'>" + data[i].code + " " + data[i].section + " " + data[i].semester + "</li>")
            let addButton = createAddCourseButton(data[i])
            // let removeButton = createRemoveCourseButton(data[i])
            let infoButton = createCourseInfoButton(data[i])
            newItem.append(addButton)
            // newItem.append(removeButton)
            newItem.append(infoButton)
            newList.append(newItem)
        }
    }
    newList.addClass("border border-primary")
    return newList
}

const createMatchedUserList = function(currInput, id, data) {
    let currInputLen = currInput.length
    let newList = $("<ul class='list-group'></ul>")
    newList.attr("id", id)
    for(let i = 0; i < data.length; i++) {
        if(data[i].name.substring(0, currInputLen) === currInput) {
            let newItem = $("<a href='#aboutModal' data-toggle=\"modal\" data-target=\"#myModal\"><li class='list-group-item'>" + data[i].name + "</li></a>")
            newItem.on("mouseenter", function(e){
                e.preventDefault()
                $(this).addClass("bg-success");
            })

            newItem.on("mouseleave", function(e){
                e.preventDefault()
                $(this).removeClass("bg-success");
            })
            newItem.click(function() {
                // TODO, Call models and get the wanted user!
                RequestModel.getUserInfo('/userprofile/displayuser', newItem.text(), updateView)
            })
            newList.append(newItem);
        }
    }
    newList.addClass("border border-primary")
    return newList
}

const generateMatchedUsers = function() {
    $("div#matchedUserListWrapper").remove()
    if(searchUser.val() === "") {
        return
    }

    const allUsersRequest = new Request("/index/allusers", {
        method: 'get',
        credentials: "same-origin",
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
        }
    })

    fetch(allUsersRequest).then(
        (res) => {
            if(res.status === 200) {
                return res.json()
            } else {
            }
        }
    ).then(
        (res) => {
            const sample = res.users
            let currInput = searchUser.val()

            let newElement = createMatchedUserList(currInput, "matchedUserList", sample)

            let wrapper = $("<div></div>")
            if(newElement.children().length === 0) {
                wrapper.text("No users are found")
                wrapper.css("color", "red")
            } else {
                wrapper.append(newElement);
            }

            wrapper.attr("id", "matchedUserListWrapper")
            let position = searchUser.offset();
            let height = $("#jumbotron").height() + $("#navbar").height() + 10
            wrapper.css("height", "200px");
            wrapper.css("overflow", "auto")
            wrapper.css("position", "fixed");
            wrapper.css("left", String(position.left)+"px")
            wrapper.css("top", height + "px")
            wrapper.css("width", String(searchCourseWrapper.width()) + "px")
            wrapper.addClass("d-inline")

            $("body").append(wrapper);
        }
    ).catch((error) => {
        log(error)
    })
}



const generateMatchedCourses = function() {
    $("div#matchedCourseListWrapper").remove()
    if(searchCourse.val() === "") {
        return
    }

    // access users' information from database
    const allCoursesRequest = new Request("/index/allcourses", {
        method: 'get',
        credentials: "same-origin",
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
        }
    })

    fetch(allCoursesRequest).then((res) => {
        if(res.status === 200) {
            return res.json()
        } else {
        }
    }).then((res) => {
        const sample = res.courses
        let currInput = searchCourse.val().toUpperCase()

        let newElement = createMatchedCourseList(currInput, "matchedCourseList", sample)

        let wrapper = $("<div></div>")
        if(newElement.children().length === 0) {
            wrapper.text("No courses are found")
            wrapper.css("color", "red")
        } else {
            wrapper.append(newElement);
        }

        wrapper.attr("id", "matchedCourseListWrapper")
        let position = searchCourse.offset();
        let height = $("#jumbotron").height() + $("#navbar").height() + 10
        wrapper.css("height", "200px");
        wrapper.css("overflow", "auto")
        wrapper.css("position", "fixed");
        wrapper.css("left", String(position.left)+"px")
        wrapper.css("top", height + "px")
        wrapper.css("width", String(searchCourseWrapper.width()) + "px")
        wrapper.addClass("d-inline")

        $("body").append(wrapper);
    }).catch((error) => {
        //log("generateMatchedCourse error", error)
    })

}

searchCourse.on("keyup", function(e){
    e.preventDefault()
    generateMatchedCourses()
});

searchUser.on("keyup", function(e) {
    e.preventDefault()
    generateMatchedUsers()
});

searchCourse.on("click", generateMatchedCourses);

searchUser.on("click", generateMatchedUsers);

$("#loginLink").click(function(){
    jumpTo("login.html");
})

$("#adminModel").click(function(){
    jumpTo("adminView.html");
})

$("body").click(function(e){
    // e.preventDefault()
    if(e.target.id === "searchCourse" || e.target.id === "searchUser") {
        return
    }
    if(e.target.id !== "matchedCourseListWrapper" && e.target.className !== "list-group-item" && $("#matchedCourseListWrapper").length > 0) {
        $("#matchedCourseListWrapper").remove()
    }
    if(e.target.id !== "matchedUserListWrapper" && e.target.className !== "list-group-item" && $("#matchedUserListWrapper").length > 0) {
        $("#matchedUserListWrapper").remove()
    }
})


function updateView(res){
    let user = res[0]
    const name = document.querySelector("#displayname")
    const email = document.querySelector('#displayemail')
    const intro = document.querySelector('#displayintro')
    const table = document.querySelector('#coursetable')
    name.innerHTML = user.name + " " + "<small>" + " " + user.programs + " " + "</small>" + "<small>" + user.year + " year student."  +"</small>"
    email.innerText = user.email

    intro.innerText = user.selfIntro
    addCourse(user, table)
}

function addCourse(user, courseTable){
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

const days = {1:"Monday", 2:"Tuesday", 3:"Wednesday", 4:"Thursday", 5:"Friday"}