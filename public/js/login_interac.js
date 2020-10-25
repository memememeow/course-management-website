let username = $("#username")

let password = $("#password")
let RequestModels = allRequests()

// RequestModels.initData()

// click register button to shift pages
$("#regButton").click(function(){
	// Simply go to the registrationView.
    window.location.href = "registrationView"
})

// hide or display password according to the checkbox
let togglePassword = function() {
    let password = $("#password")
    let checked = $("#showPassword").prop("checked");
    if(checked) {
        password.attr("type", "text");
    } else {
        password.attr("type", "password");
    }
}

$("#showPassword").click(togglePassword);