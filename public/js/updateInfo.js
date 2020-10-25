/* Here are the data that are stored in the server. */
const allUser = returnUsers()
const user = allUser[2]
const allprograms = returnPrograms()
const RequestModel = allRequests()

/* Add event listeners. */
const addProgramBar = document.querySelector("#addProgram")
const submitButton = document.querySelector(".submitProfile")
submitButton.addEventListener("click", updateUser)
addProgramBar.addEventListener("click", addProgram)
RequestModel.getMyInfo('/changeInfo/getDisplay', fillForm)

/*
 * Fill up default info using values from user.
 */
function fillForm(res){
	let user = res[0]
    const typeAbles = document.querySelectorAll(".typeAble")
    typeAbles[0].setAttribute("value", user.email)
    typeAbles[1].setAttribute("value", user.name)
    typeAbles[2].setAttribute("value", user.year)

    const intro = document.querySelector("#selfIntro")
    intro.innerText = user.selfIntro
	addProgram(user.program)
}

/*
 * Convert list of programs into html.
 */
function convertProgram(programs){
	let res = ""
	for(let i = 0; i < programs.length; i ++){
		res += "<option value=" + programs[i] + ">" + programs[i]
	}
	return res
}


/*
 * Add a new program choosing bar.
 */ 
function addProgram(prog){
    if(! prog) {
        const curProgram = document.querySelector("#curProgram")
        curProgram.innerText = ""
        const allprogram = document.querySelector(".program")
        const newBar = document.createElement("select")
        newBar.innerHTML = convertProgram(allprograms)
        newBar.classList.add("program")
        allprogram.appendChild(newBar)
    } else {
        const curProgram = document.querySelector("#curProgram")
        curProgram.innerText = ""
        const allprogram = document.querySelector(".program")
        const newBar = document.createElement("select")
        newBar.innerHTML = convertProgram(allprograms)
        newBar.classList.add("program")
        newBar.value = prog
        allprogram.appendChild(newBar)
    }

}
/*
 * Update the personal info of a user.
 */
function updateUser(){
	const user = {}
	const allInfo = document.querySelectorAll(".typeAble")
	const email = allInfo[0]
	const userName = allInfo[1]
	const programs = getPrograms()
	const age = allInfo[2]
	const pwd = allInfo[3]
	const intro = document.querySelector('#selfIntro')

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
    if(userName.value === ""){
		alert("Please type in valid username")
		return
	}
	if(userName.value) {
        user.name = userName.value
    }
	if(programs.length !== 0){
		user.program = programs
	}
	if(!validInt(age.value)){
		alert("Please type in valid year")
		return
	}
	if(age.value) {
        user.year = age.value
    }
	if(intro.value !== 'undefined') {
        user.intro = intro.value
    }
    // Will need to update list of users in the server.
    // Server side code will be implemented in phase2.

	return RequestModel.updateInfo(user)
}

/*
 * Print the user's info in the alert window.
 */
function printUser(newUser){
	let message = " Successfully create a new user with name " + newUser.name + " with email " + newUser.mail + " year: " + newUser.year
	message = message + " and  programs " + newUser.program 
	alert(message)
}

/*
 * Check if an email is valid(containing '@' and '.')
 */
function validEmail(email) {
	return !/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(email)
}

function getPrograms(){
	const lst = []
	try{
		const programs = document.querySelectorAll(".program")
		for(let i = 0; i < programs.length; i++){
			const program = programs[i].value
			if(! lst.includes(program) && program){
				lst.push(program)
			}
		}
		return lst
	} catch(error) {
		return []
	}
}

/*
 * Check if a value contains only int.
 */
function validInt(value){
	var re = /[0-9]*/
	return re.test(value)
}
