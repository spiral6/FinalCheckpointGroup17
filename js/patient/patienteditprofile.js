window.onload = async function() { 
    
    EditProfileForm = document.querySelector("form[name=patient_edit_form]");
    EditProfileForm.addEventListener('submit', function(e) {
        e.preventDefault();  
        EditProfileFormData = new FormData(document.querySelector("form[name=patient_edit_form]"));
        var EditProfileDataObject = {}
        for (var pair of EditProfileFormData.entries()) {
          EditProfileDataObject[pair[0]] = pair[1];
        }
        console.log(EditProfileDataObject);
        if($("#doctor_save_changes_button").text() == "Save Changes") {
          console.log("submitting appointment from form");
          UpdateProfile(EditProfileDataObject);
        } 

  });

  FillProfileData();
}

async function UpdateProfile(JSONObject){
  if(JSONObject['fname'] && JSONObject['lname']){
    JSONObject['staff_name'] = JSONObject['fname'] + " " + JSONObject['lname'];
  }

  const request = await fetch(window.location.origin + '/patient/db/profile',  {
    method: 'put',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(JSONObject)
  }).then(response => {
    if (!response.ok) {
      response.text().then(err => {
        alert(`HTTP error: ${response.status} \n${JSON.parse(err).text}`);
      })  
    }
    return response.text();
  }).then(body => {
    alert("Successfully updated patient Profile!")
    console.log(body);
    FillProfileData();
  });

}

async function FillProfileData(){
  const request = await fetch(window.location.origin + '/patient/db/profile',  {
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
    // alert("Successfully retrieved Appointment!")
    console.log("successfully retrieved doctor info");
    console.log(body);
    body = JSON.parse(body);
    // body = validateAppointmentData(body);
    // appointmentDataObject = body;
    updateProfileUI(body);
    // refreshAppointmentTable();
  });
}

function updateProfileUI(body){
  for (const row of body){
    $("#firstName").val(row.pat_name.split(' ')[0]);
    $("#lastName").val(row.pat_name.split(' ')[1]);
    $("#pat_sex").val(row.pat_sex);
    $("#pat_DoB").val(new Date(row.pat_DoB).toLocaleDateString("en-CA"));
    $("#pat_phone").val(row.pat_phone);
    $("#pat_email").val(row.pat_email);
    $("#doc_specialty").val(row.doc_specialty);
    $("#pat_insurance").val(row.pat_insurance);
    $("#pat_address").val(row.pat_address);
  }
}