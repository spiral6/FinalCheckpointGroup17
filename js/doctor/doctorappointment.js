appointmentDataObject = [];
selectedRow = null;

  function formClear() {
    $("#firstName").val("");
    $("#lastName").val("");
    $("#app_time").val("");
    $("#loc_name").val("");
  }

  function removeAppointment(ctl) {
    if (confirm('Do you want to delete appointment?')){
      selectedRow = $(ctl).parent().parent().attr("app_id");
      console.log(selectedRow);
      DeleteAppointment({app_id: null});
    }
  }

  window.onload = async function() { 
    
    CreateAppointmentForm = document.querySelector("form[name=create_appointment_form]");
    CreateAppointmentForm.addEventListener('submit', function(e) {
        e.preventDefault();  
        CreateAppointmentFormData = new FormData(document.querySelector("form[name=create_appointment_form]"));
        var AppointmentDataObject = {}
        for (var pair of CreateAppointmentFormData.entries()) {
          AppointmentDataObject[pair[0]] = pair[1];
        }
        console.log(AppointmentDataObject);
        if($("#CreateUpdateAppointmentButton").text() == "Schedule Appointment") {
          console.log("submitting appointment from form");
          AddAppointment(AppointmentDataObject);
        } 

  });

  refreshAppointmentTable();
  getLocation();
}

async function AddAppointment(JSONObject){
  if(JSONObject['fname'] && JSONObject['lname']){
    JSONObject['pat_name'] = JSONObject['fname'] + " " + JSONObject['lname'];
  }
  if($('#app_source_web').is(':checked')) { 
    JSONObject['app_source'] = "Web";
  }
  if($('#app_source_phone').is(':checked')) { 
    JSONObject['app_source'] = "Phone";
  }
  const request = await fetch(window.location.origin + '/doctor/db/appointment',  {
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
    alert("Successfully added Appointment!")
    console.log(body);
    refreshAppointmentTable();
  });

}

async function DeleteAppointment(JSONObject){
  if(selectedRow){
    JSONObject['app_id'] = selectedRow;
  }
  console.log(JSONObject);
  const request = await fetch(window.location.origin + '/doctor/db/appointment',  {
    method: 'delete',
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
    alert("Successfully deleted Appointment!")
    console.log(body);
    refreshAppointmentTable();
  });
}


async function refreshAppointmentTable(){
  const request = await fetch(window.location.origin + '/doctor/db/appointment',  {
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
    console.log("successfully retrieved appointments");
    console.log(body);
    body = JSON.parse(body);
    body = validateAppointmentData(body);
    appointmentDataObject = body;
    updateAppointmentTableUI(body);
    // refreshAppointmentTable();
  });
}

function validateAppointmentData(body){
  for (const row of body){
    const name = row.pat_name.split(' ');
    row.fname = name[0];
    row.lname = name[1];
    if(row.app_time){
      row.app_time = new Date(row.app_time).toLocaleString();
    }
  }
  return body;
}

function updateAppointmentTableUI(body){

  $("#appointmentTable tbody").empty();

  for (const row of body){
    
    $("#appointmentTable tbody").append(`<tr app_id=${row.app_id}>` +
      "<td>" + row.app_time + "</td>" +
      "<td>" + row.pat_name + "</td>" +
      "<td>" + row.loc_name + "</td>" +
      "<td>" + row.app_source + "</td>" +
      "<td>" + "<button class='btn btn-lg btn-primary btn-block' onclick='removeAppointment(this);''><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-trash' viewBox='0 0 16 16'><path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z'/><path fill-rule='evenodd' d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z'/></svg></button>" + "</td>" +
      "</tr>");
  }
}

async function getLocation(){
  const response = await fetch(window.location.origin + '/patient/db/clinic',  {
    method: 'get',
    headers: {
        'Content-Type': 'application/json'
    }
    // body: JSON.stringify(id)
  }).then(response => {
    if (!response.ok) {
      response.text().then(err => {
        alert(`HTTP error: ${response.status} \n${JSON.parse(err).text}`);
      })  
    }
    return response.text();
  }).then(body => {
    // alert("Successfully retrieved Appointment!")
    console.log("successfully retrieved locations");
    console.log(body);
    body = JSON.parse(body);
    updateLocationTable(body);
    // refreshAppointmentTable();
  });
}

function updateLocationTable(body){

  $("#loc_name").empty();

  for (const row of body){
    console.log(row);
    $("#loc_name").append("<option>" + row.loc_name + "</option>");
  }

}