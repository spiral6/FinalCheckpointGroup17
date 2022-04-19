async function SignUp(JSONObject){
    // DEBUG staff signup
    console.log(JSON.stringify(JSONObject))

    const response = await fetch('/staff/signup', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect:'follow',
        body: JSON.stringify(JSONObject)
    }).then(response => {
            console.log(response.status)
            if(response.status === 200){
                alert("Successfully signed up!")
            } else {
                response.text().then( function (text){
                    if(text.includes("Duplicate")){
                        alert("An account with that email exists.");
                    } else {
                        alert(text);
                    }
                })
            }
            //response.text()
        }
    )
}

window.onload = function() { 
    StaffSignupForm = document.querySelector("form[name=staff_register_form]")
    StaffSignupForm.addEventListener('submit', function(e) {
        e.preventDefault()
        console.log("Submitting staff registration form...");
        StaffSignupFormData = new FormData(document.querySelector("form[name=staff_register_form]"));

        var StaffSignupFormDataObject = {}
        pat_name = "";
        for (var pair of StaffSignupFormData.entries()) {
            if(pair[0] === "fname"){
                pat_name += pair[1] + " ";
            } else if (pair[0] === "lname"){
                pat_name += pair[1];
                StaffSignupFormDataObject["staff_name"] = staff_name;
            } else {
                StaffSignupFormDataObject[pair[0]] = pair[1];
            }
            
        }

        SignUp(StaffSignupFormDataObject);
    })
};