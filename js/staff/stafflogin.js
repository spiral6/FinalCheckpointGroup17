async function StaffSignInAction(JSONObj){
    
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

async function StaffSignInFormInit(){
    StaffSignInForm = document.querySelector("form[name=staff_signin_form]")
    StaffSignInForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log("Submitting staff login form...");
        StaffSignInFormData = new FormData(document.querySelector("form[name=staff_signin_form]"));

        var StaffSignInFormDataObject = {}
        for (var pair of StaffSignInFormData.entries()) {
            StaffSignInFormDataObject[pair[0]] = pair[1];
        }
        console.log(StaffSignInFormDataObject);

        StaffSignInAction(StaffSignInFormDataObject);
    })
}

window.onload = async function() { 
    // StaffSignInForm = document.querySelector("form[name=patient_signin_form]")
    // StaffSignInForm.addEventListener('submit', function(e) {
    //     e.preventDefault();
    //     console.log("Submitting staff login form...");
    //     StaffSignInFormData = new FormData(document.querySelector("form[name=StaffSignInForm]"));
    // })
    await StaffSignInFormInit()

};