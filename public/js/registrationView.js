/* Here are the data that are stored in the server. */
const users = returnUsers()
const allprograms = returnPrograms()

// Add listener to the buttons.
const submitButton = document.querySelector("#submitProfile")
submitButton.addEventListener("click", createUser)
const requestModule = allRequests()


/* 
 * Create a new user and detect any possible invalid arguments.
 * Since there is no server side involved here, new user will be displayed using a helper 
 * instead of being passed to the server. 
 * Require server side code in phase2.
 */ 
function createUser(){
	const allInfo = document.querySelectorAll(".typeAble")
	const email = allInfo[1]
	const userName = allInfo[0]
	const pwd = allInfo[4]
	const pwdd = allInfo[5]
	const year = allInfo[2]
	const program = allInfo[3]
    const newUser =  new User(userName.value, email.value)

    if(!year.value){
		alert("Please type in a year")
		return
	}
	newUser.year = year.value

    if(!program.value){
        alert("Please type in a year")
        return
    }
	newUser.programs = program.value

    if(email.value == null || !validEmail(email)){
		alert("Please type in valid email")
		return 
	}
	if(userName.value === ""){
		alert("Please type in valid username")
		return
	}

	if(pwd.value === "" || pwd.value == null){
		alert("Password cannot be none.")
		return
	}
	if(pwd.value !== pwdd.value) {
        alert("Two password does not match.")
        return
    }
	newUser.password = pwd.value
	return requestModule.register(newUser)
}

/*
 * Check password.
 */
function validEmail(email) {
	return !/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(email)
}
