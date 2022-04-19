async function PatientSignInAction(JSONObj){
    
    const response = await fetch(window.location.origin + '/login', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect:'follow',
        body: JSON.stringify(JSONObj)
    }).then(response => {
            if(response.status === 200){
                window.location.href = "/";
            } else if (response.status === 403){
                alert("Error, incorrect credentials.")
            } else {
                alert("Unknown error.")
            }
            //response.text()
        }
    )
}

async function PatientSignInFormInit(){
    PatientSignInForm = document.querySelector("form[name=patient_signin_form]")
    PatientSignInForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log("Submitting staff login form...");
        PatientSignInFormData = new FormData(document.querySelector("form[name=patient_signin_form]"));

        var PatientSignInFormDataObject = {}
        for (var pair of PatientSignInFormData.entries()) {
            PatientSignInFormDataObject[pair[0]] = pair[1];
        }
        console.log(PatientSignInFormDataObject);

        PatientSignInAction(PatientSignInFormDataObject);
    })
}

window.onload = async function() { 
    // PatientSignInForm = document.querySelector("form[name=staff_signin_form]")
    // PatientSignInForm.addEventListener('submit', function(e) {
    //     e.preventDefault();
    //     console.log("Submitting staff login form...");
    //     PatientSignInFormData = new FormData(document.querySelector("form[name=PatientSignInForm]"));
    // })
    await PatientSignInFormInit()

};