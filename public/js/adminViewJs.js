let allCourseLst=undefined;
let allUserLst=undefined;

let tblBdy = document.querySelectorAll('tbody');
for (let i=0;i<tblBdy.length;i++){
    tblBdy[i].addEventListener('click',deleteRow);
}
const RequestModel = allRequests()
RequestModel.getAllCourse(readAllCourse)

RequestModel.getAllUser(readAllUser)


// init when page load.
function readAllCourse(res) {
    allCourseLst = res.course
    loadCourseTbl(res.course)
    loadCourse(res.course[res.course.length-1].code, res)
}

function readAllUser(res) {
    allUserLst = res.user
    loadStudentTbl(res.user);
}

$('tbody').on('click', '.course', function(){
    let courseCode = $(this)[0].innerText.slice(0,6)
    RequestModel.getOneCourseInfo(courseCode, loadCourse)
});


// delete course from server data
function deleteCourse(courseCode){
    let newAllCourses=[];
    for (let i=0;i<allCourseLst.length;i++){
        if (allCourseLst[i].code !== courseCode){
            newAllCourses.push(allCourseLst[i]);
        }
    }
    setCourses(newAllCourses);
}


// delete a user or delete a course from left side search table
function deleteRow(e){
    e.preventDefault();
    if (e.target.classList.contains('deleteStudent') || e.target.classList.contains('deleteCourse')) {
        // delete student
        if (e.target.classList.contains('deleteStudent')){
            let choice = confirm("Are you sure you want ot delete this student?");
            if (choice){
                let targetRow = e.target.parentElement.parentElement;
                let delUserName = targetRow.cells[0].innerText;
                RequestModel.admindeleteUser(delUserName)
                let tbd = e.target.parentElement.parentElement.parentElement;
                tbd.removeChild(targetRow);
            }
        }
        // delete student
        if (e.target.classList.contains('deleteCourse')){
            let choice = confirm("Are you sure you want ot delete this course?");
            if (choice){
                let targetRow = e.target.parentElement.parentElement;
                let delCourseCode = targetRow.cells[0].innerText.slice(0,6);
                let section = targetRow.cells[0].innerText.split(" ")[1];
                let semester = targetRow.cells[0].innerText.split(" ")[2];
                RequestModel.deleteCourse(delCourseCode, section, semester)
                let tbd = e.target.parentElement.parentElement.parentElement;
                tbd.removeChild(targetRow);
            }
        }
    }
}


// load a course's information to right side of webpage
function loadCourse(courseCode, courseLst) {
    let targetCourse;
    let allCourseLst = courseLst.course;
    for (let i =0;i<allCourseLst.length;i++){
        if (courseCode === allCourseLst[i].code){
            targetCourse = allCourseLst[i];
        }
    }
    $('#courseCode')[0].innerText = targetCourse.code + targetCourse.semester;
    $('#courseName')[0].innerText = targetCourse.name;
    $('#courseIntro')[0].innerText = targetCourse.intro;
    $(".sectionInfo").html("");
    let secBdy = $(".sectionInfo");


    let secId = $("<strong></strong>").text(targetCourse.section);
    let secRow = $("<p></p>");
    secRow.prepend(secId);
    secRow.class = 'secId';

    let ulP = $('<ul></ul>');
    let profP = $("<strong></strong>").text('Prof: ');
    let profRow = $("<p></p>").text(targetCourse.Instructor);
    profRow.prepend(profP);
    profRow.className = 'secProf';

    let timeP = $("<strong></strong>").text('Time: ');
    let timeRow = $("<p></p>").text(toTimeStr(targetCourse.times));
    timeRow.prepend(timeP);
    timeRow.className = 'secTime';

    let locP = $("<strong></strong>").text('Location: ');
    let locRow = $("<p></p>").text(targetCourse.location);
    locRow.prepend(locP);
    locRow.className = 'secLoc';

    ulP.append(profRow, timeRow, locRow);

    secBdy.append(secRow, ulP);

}

// getting information of admin type in for constructing a new course
$('#confirmBtn')[0].addEventListener('click', addNewCourse);
function addNewCourse(){
    let semester = $("#newSemester").val()
    let courseCode = $("#newCourseCode").val()
    let courseName = $("#newName").val();

    let newSecId, newProf, newTime, newLoc, newContent;
    newSecId = $('#newSec').val();
    newProf = $('#newProf').val();
    newTime = $('#newTime').val();
    newLoc = $('#newLoc').val();
    newContent = $('#newContent').val();
    if(!newSecId || !newProf || !newTime || !newLoc || !newContent){
        return
    }

    RequestModel.addNewCourse(semester, courseCode, courseName,newSecId, newProf, newTime, newLoc, newContent)
    RequestModel.getAllCourse(readAllCourse)

    $('#newCourseForm')[0].reset()
}

// convert course's times attribute to human readable output
function toTimeStr(timeLst){
    let res = '';
    for (let i=0;i<timeLst.length;i++){
        let subLst = timeLst[i].split("-");
        switch(subLst[0]) {
            case '1':
                res += 'M';
                break;
            case '2':
                res += 'T';
                break;
            case '3':
                res += 'W';
                break;
            case '4':
                res += 'TH';
                break;
            default:
                res += 'F';
                break;
        }
        res+=subLst[1]+"-"+subLst[2];
        res+=", "
    }
    return res.slice(0,-2);
}

// seaarch function implementation of left two search table
function searchFunc(tblContent) {
    // Declare variables
    if (tblContent === 'student'){
        let input, filter, table, tr, td, i, txtValue;
        input = document.getElementById("studentInput");
        filter = input.value.toUpperCase();
        table = document.getElementById("studentTable");
        tr = table.getElementsByTagName("tr");

        // Loop through all table rows, and hide those who don't match the search query
        for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td")[0];
            if (td) {
                txtValue = td.textContent || td.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    } else if (tblContent === 'course'){
        let input, filter, table, tr, td, i, txtValue;
        input = document.getElementById("courseInput");
        filter = input.value.toUpperCase();
        table = document.getElementById("courseTbl");
        tr = table.getElementsByTagName("tr");

        // Loop through all table rows, and hide those who don't match the search query
        for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td")[0];
            if (td) {
                txtValue = td.textContent || td.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    }
}

// read server side data to student table
function loadStudentTbl(userList){
    let exampleRow = document.querySelector('.student');
    for (let i=0; i<userList.length;i++){
        let newRow = exampleRow.cloneNode(true);
        newRow.children[0].innerText = userList[i].name;
        exampleRow.parentElement.appendChild(newRow);
    }
    exampleRow.parentElement.removeChild(exampleRow);

}


// read server side data to student table
function loadCourseTbl(lstOfCourse){
    $("#courseTblBy").html("");
    let tableBody = $('#courseTblBy');

    for (let i=0; i<lstOfCourse.length;i++) {
        let row = $('<tr></tr>').attr('class', 'course');
        let displayName = $('<td></td>');
        displayName.append(lstOfCourse[i].code + " " +lstOfCourse[i].section + " " + lstOfCourse[i].semester );
        let btnDiv = $('<td></td>');
        let newBtn = $('<button></button>').attr('class', 'btn btn-outline-dark btn-sm deleteCourse');
        newBtn.append('Remove Course');
        btnDiv.append(newBtn);

        row.append(displayName);
        row.append(btnDiv);
        tableBody.append(row);
    }

}

function changeUserInfo(btn){
    let targetUserName = btn.parentElement.parentElement.firstElementChild.textContent;
    RequestModel.adminChangeInfo(targetUserName)
    window.location.href = "userprofile";
}

