async function SignUp(JSONObject){
    // DEBUG patient signup
    console.log(JSON.stringify(JSONObject))

    const response = await fetch('/patient/db/signup', {
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

async function getDoctorNames(){
    const request = await fetch(window.location.origin + '/patient/db/getDoctor',  {
        method: 'get',
        headers: {
          'Content-Type': 'application/json'
        },
        // body: JSON.stringify(JSONObject)
      }).then(response => {
        if (!response.ok) {
          response.text().then(err => {
            alert(`HTTP error: ${response.status} \n${JSON.parse(err).text}`);
          })  
        }
        return response.text();
      }).then(body => {
        // alert("Successfully retrieved Doctors!")
        console.log(JSON.parse(body));
        body = JSON.parse(body);
        for(const row in body){
            $("#doctor_select").append("<option>" + body[row].staff_name + "</option>");
            $("#find_doctorselect").append("<option>" + body[row].staff_name + "</option>");
        }
      });
}

window.onload = function() { 
    
    const viewDoctorInfoButton = document.getElementById('doctor_select');
    if(viewDoctorInfoButton){
        getDoctorNames();
    }

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
    });
    
};