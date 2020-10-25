const requestModels = allRequests()
// Event of mouse enter stars:
// Light the stars from start when mouse enter the star
const usersImage = $('.showUsers')
for(let i = 0 ; i < usersImage.length; i++){
  usersImage[i].addEventListener('click',e => displayUser(e))
}
let currentScore;
const commentButton = $('#commentButton')[0]
commentButton.addEventListener('click', addComment)

// A function that sends a request to the server, leave an comment and append
// the comment to this page.
function addComment(){
    let messages = $('#courseName')[0].innerText.split('-')
    if (!$('#inputContent')[0].value){
        return alert("Please type in some comment.")
    }
    requestModels.leaveComment({
        "code":messages[0],
        "section":messages[1],
        "semester":messages[2].split(":")[0],
        "comment": $('#inputContent')[0].value,
        "rate": currentScore
    }, updateCommentView)
}


addStar(parseInt($('#courseFinalRate')[0].innerText))

function addStar(rate){
    log("Update stars")
    let courseStars = $('#courseFinalRate')[0]
    courseStars.innerHTML = null
    for(let i = 0 ; i < parseInt(rate); i++){
        courseStars.innerHTML += "<span class='fa fa-star fa-3x checked'></span>"
    }
    for(let i = parseInt(rate); i < 5; i++){
        courseStars.innerHTML += "<span class='fa fa-star fa-3x'></span>"
    }
}

function updateCommentView(res){
    let userName = res._id
    let content = res.content
    let rate = res.rate

    let comment = document.createElement('div')
    comment.classList.add('comment')
    let commentor = document.createElement("div")
    commentor.classList.add('commenter')
    commentor.innerHTML = "<a href='#aboutModal' data-toggle='modal' data-target='#myModal' class='showUsers'>" + userName + "</a>"
    comment.appendChild(commentor)
    comment.innerHTML += "<div class='ratingStars'>"
    let ratingstars = document.createElement("div")
    ratingstars.classList.add('ratingStars')
    for(let i = 0; i < parseInt(rate); i++){
        ratingstars.innerHTML +=  "<span class='fa fa-star fa-lg checked'></span>"
    }
    for(let i = parseInt(rate); i < 5; i++){
        ratingstars.innerHTML += "<span class='fa fa-star fa-lg'></span>"
    }
    comment.appendChild(ratingstars)
    comment.innerHTML += "<div class='commentConstant'>" + content +"</div>"

    $('#pastComments')[0].appendChild(comment)

    $('#courseRate')[0].innerText = parseFloat(res.rate).toFixed(3)
    $('#totalRating')[0].innerText = res.length

    let courseStars = $('#courseFinalRate')[0]
    courseStars.innerText = null
    for(let i = 0 ; i < res.rate; i++){
        courseStars.innerHTML += "<span class='fa fa-star fa-lg checked'></span>"
    }
    for(let i = res.rate; i < 5; i++){
        courseStars.innerHTML += "<span class='fa fa-star fa-lg'></span>"
    }
    addStar(res.rate)
}

function displayUser(e){
    requestModels.getUserInfo('/userprofile/displayuser', e.target.innerText, updateView)
}


// Functions for adding stars.
$('#inputRatingStars .star').mouseenter(function(e) {
    event.preventDefault();
    let index = $(this).index();

    for (let i = 0; i <= index; i++) {
        $('#inputRatingStars .star')[i].classList.add('checked');
    }
});


$('#inputRatingStars .star').click(function(e) {
    event.preventDefault();
    let index = $(this).index();

    if (index == 0) {
        $('#inputRatingStars .star')[0].classList.add('checked');
    }

    score = index+1;
    currentScore = score
});

// Event of mouse leave stars:
$('#inputRatingStars .star').mouseover(function(e) {
    event.preventDefault();
    let index = $(this).index();

    for (let i = index+1; i < 5; i++) {
        $('#inputRatingStars .star')[i].classList.remove('checked');
    }
    if (index == 0) {
        $('#inputRatingStars .star')[0].classList.remove('checked');
    }
});

// Functions for displaying users.
function updateView(res){
    let user = res[0]
    const name = document.querySelector("#displayname")
    const email = document.querySelector('#displayemail')
    const intro = document.querySelector('#displayintro')
    const table = document.querySelector('#coursetable')
    name.innerHTML = user.name + " " + "<small>" + " " + user.programs + " " + "</small>" + "<small>" + user.year + " year student."  +"</small>"
    email.innerText = user.email
    // program.innerText = user.programs
    // year.innerText = user.year
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
