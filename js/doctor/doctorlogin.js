async function DoctorSignInAction(JSONObj){
    
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

async function DoctorSignInFormInit(){
    DoctorSignInForm = document.querySelector("form[name=doctor_signin_form]")
    DoctorSignInForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log("Submitting doctor login form...");
        DoctorSignInFormData = new FormData(document.querySelector("form[name=doctor_signin_form]"));

        var DoctorSignInFormDataObject = {}
        for (var pair of DoctorSignInFormData.entries()) {
            DoctorSignInFormDataObject[pair[0]] = pair[1];
        }
        console.log(DoctorSignInFormDataObject);

        DoctorSignInAction(DoctorSignInFormDataObject);
    })
}

window.onload = async function() { 
    // PatientSignInForm = document.querySelector("form[name=staff_signin_form]")
    // PatientSignInForm.addEventListener('submit', function(e) {
    //     e.preventDefault();
    //     console.log("Submitting staff login form...");
    //     PatientSignInFormData = new FormData(document.querySelector("form[name=PatientSignInForm]"));
    // })
    await DoctorSignInFormInit()

};