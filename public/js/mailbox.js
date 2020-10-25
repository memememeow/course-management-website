/* Pulled from database. */
const RequestModule = allRequests()
let currentUser;

/* Update event handler. */
const maincontainer = document.querySelector("#mainContainer")
maincontainer.addEventListener('click', tryDelete)
const sent = document.querySelector('#mailsSent')
const inbox = document.querySelector('#inbox')
const sendButton = document.querySelector("#sendButton")
sendButton.addEventListener('click', sendMail)
const broadcasts = document.createElement('input')


/*
 * A function to update the guidance for admin.
 */ 
function updateAminMsg(){
	let sendmailContainer = document.querySelector('#sendMail')
	broadcasts.setAttribute("type", "button")
	broadcasts.classList.add("btn")
	broadcasts.classList.add("btn-outline-primary")
	broadcasts.classList.add("btn-sm")
	broadcasts.setAttribute("id", "broadCastButton")
	broadcasts.setAttribute("value", "broadcasts")
	broadcasts.addEventListener("click", broadcastTo)
    sendmailContainer.appendChild(broadcasts)
    const userTypein = document.querySelector('#title')
    let notice = ""
    notice += "<p>Login as admin</p><p>Use broadcast to send message to (all users)</p>"
    userTypein.innerHTML = notice
}


/*
 * A function to broad cast message to all users or all students in a certain course 
 * depending on the send to's input.
 */
function broadcastTo(e){
	e.preventDefault()
    const receiver = document.querySelector("#receiverName").value
    const content = document.querySelector("#inputContent").value

    const newMail = {
        "receiver":receiver,
        "content":content
    }
    if(receiver.toUpperCase() === "ALL"){
        RequestModule.broadcast(newMail, function(newmail){
            sent.insertBefore(mailHTML(newmail), sent.children[1])
            inbox.insertBefore(mailHTML(newmail), inbox.children[1])
        })
	} else {

    }
}

/*
 * A function that convert email into html.
 */
function mailHTML(email, isIn){
    const time = document.createElement("div")
    time.innerHTML  = "<div>" + email._id + "</div>"
 	const emailContainer = document.createElement("div")
	emailContainer.classList.add("mail")
	const lnk = document.createElement('a')
	lnk.setAttribute("href", "userprofile.html")
	lnk.innerHTML = "<img src='/img/profileImg.png' class='senderImg'>"

	const receiver = document.createElement("div")
	receiver.classList.add('d-inline', 'receiver')
    if(isIn){
        receiver.innerText = "From: " + email.other
        time.classList.add("INBOX")
    } else {
        receiver.innerText = "To: " + email.other
        time.classList.add("SEND")
    }

	const content = document.createElement("div")
	content.classList.add("mailConstant")
	content.innerText = email.content

    const deleteButton = document.createElement("div")
    deleteButton.classList.add('d-inline', 'delete')
    deleteButton.innerHTML = "<button type='button' class='deleteButton'>delete</button>"
    emailContainer.appendChild(time)
	emailContainer.appendChild(lnk)
	emailContainer.appendChild(receiver)
    emailContainer.appendChild(deleteButton)
	emailContainer.appendChild(content)

	return emailContainer

}


/*
 * A function that update email containers using data from database.
 */
function displayEmail(users){
    // The current user loged in.
    currentUser = users.currentuser
    let auser = users.user[0]
    if(users.currentuser === "admin") {
        $("#adminModel").parent().removeClass("d-none")
    } else {
        $("#adminModel").parent().addClass("d-none")
    }
	for(let i = auser.inbox.length - 1; i >= 0; i--){
		inbox.appendChild(mailHTML(auser.inbox[i], true))
	}

	for(let i = auser.send.length - 1; i >= 0 ; i--){
		sent.appendChild(mailHTML(auser.send[i], false))
	}
	/* Update guidance  for admin. */
    if(auser.name === "admin"){
        updateAminMsg()
    }
}

    /*
     * Function To handle sending email.
     * The sent mail will only be added to the sent email-sent container. Server side function
     * will be added in phase2.
     */
function sendMail(e){
	e.preventDefault()
	const receiver = document.querySelector("#receiverName").value
	const content = document.querySelector("#inputContent").value
	//const appendMail = new Mail(receiver.value, content)
	//auser.send.push(newMail)

    const newMail = {
        "receiver":receiver,
        "content":content
    }
    RequestModule.sendmail(newMail, function(newmail){
        sent.insertBefore(mailHTML(newmail), sent.children[1])
        if(receiver === currentUser){
            inbox.insertBefore(mailHTML(newmail), inbox.children[1])
        }
    })

    // Server side funtions will be added below in phase2.
}


/*
 * A function that is called when user try to delete email. This function will simply delete the mail displayed
 * instead of modifying the database. Function that update the database will be added in phase2.
 */
function tryDelete(e){
    e.preventDefault()
    if(e.target.classList.contains("deleteButton")){
        let emailid = (e.target.parentNode.parentNode.children[0].innerText)
        const tobeDelete = (e.target.parentNode.parentNode)
        tobeDelete.parentNode.removeChild(tobeDelete)
        if(e.target.parentNode.parentNode.children[0].classList.contains("INBOX")){
            allRequests().deletemailInbox(emailid, true, function (){
            })
        } else {
            allRequests().deletemailSend(emailid,false, function (){
            })
        }



    }
}

(RequestModule.getMyInfo('userprofile/mypage', displayEmail))

$("#adminModel").click(function(){
    jumpTo("adminView.html");
})


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
