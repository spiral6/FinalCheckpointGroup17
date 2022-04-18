async function SignUp(JSONObject){
    // DEBUG patient signup
    console.log(JSON.stringify(JSONObject))

    const response = await fetch('/patient/signup', {
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
    PatientSignupForm = document.querySelector("form[name=patient_register_form]")
    PatientSignupForm.addEventListener('submit', function(e) {
        e.preventDefault()
        console.log("Submitting patient registration form...");
        PatientSignupFormData = new FormData(document.querySelector("form[name=patient_register_form]"));

        var PatientSignupFormDataObject = {}
        pat_name = "";
        for (var pair of PatientSignupFormData.entries()) {
            if(pair[0] === "fname"){
                pat_name += pair[1] + " ";
            } else if (pair[0] === "lname"){
                pat_name += pair[1];
                PatientSignupFormDataObject["pat_name"] = pat_name;
            } else {
                PatientSignupFormDataObject[pair[0]] = pair[1];
            }
            
        }

        SignUp(PatientSignupFormDataObject);
    })
};