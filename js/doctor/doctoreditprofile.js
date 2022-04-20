  window.onload = async function() { 
    
    EditProfileForm = document.querySelector("form[name=doctor_edit_form]");
    EditProfileForm.addEventListener('submit', function(e) {
        e.preventDefault();  
        EditProfileFormData = new FormData(document.querySelector("form[name=doctor_edit_form]"));
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

  const request = await fetch(window.location.origin + '/doctor/db/profile',  {
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
    alert("Successfully updated doctor Profile!")
    console.log(body);
    FillProfileData();
  });

}

async function FillProfileData(){
  const request = await fetch(window.location.origin + '/doctor/db/profile',  {
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
    $("#firstName").val(row.staff_name.split(' ')[0]);
    $("#lastName").val(row.staff_name.split(' ')[1]);
    $("#staff_sex").val(row.staff_sex);
    $("#staff_DoB").val(new Date(row.staff_DoB).toLocaleDateString("en-CA"));
    $("#staff_phone").val(row.staff_phone);
    $("#staff_email").val(row.staff_email);
    $("#doc_specialty").val(row.doc_specialty);
    $("#staff_occupation").val(row.staff_occupation);
    $("#staff_address").val(row.staff_address);
  }
}