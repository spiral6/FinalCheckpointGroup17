async function SignInAction(JSONObj){
    
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

async function SignInFormInit(){
    PatientSignInForm = document.querySelector("form[name=signin_form]")
    PatientSignInForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log("Submitting login form...");
        SignInFormData = new FormData(document.querySelector("form[name=signin_form]"));

        var SignInFormDataObject = {}
        for (var pair of SignInFormData.entries()) {
            SignInFormDataObject[pair[0]] = pair[1];
        }
        console.log(SignInFormDataObject);

        SignInAction(SignInFormDataObject);
    })
}

window.onload = async function() { 
    // PatientSignInForm = document.querySelector("form[name=staff_signin_form]")
    // PatientSignInForm.addEventListener('submit', function(e) {
    //     e.preventDefault();
    //     console.log("Submitting staff login form...");
    //     PatientSignInFormData = new FormData(document.querySelector("form[name=PatientSignInForm]"));
    // })
    await SignInFormInit()

};