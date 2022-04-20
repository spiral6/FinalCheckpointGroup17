appointmentDataObject = [];
selectedRow = null;

// function appointmentButtonListener() {
//     if ($("#CreateUpdateAppointmentButton").text() == "Update") {
//         appointmentUpdateInTable();
//     }
//     else {
//         appointmentAddToTable();
//     }

//     // Clear form fields
//     formClear();

//     // Focus to product name field
//     $("#firstName").focus();
// }

  function cancelEdit() {

    formClear();
    
    $("#CancelEditAppointmentButton").toggle();
    $("#CreateUpdateAppointmentButton").text("Submit Appointment");
    selectedRow = null;
  }

  // function appointmentUpdateInTable() {
  //   // Add changed appointment to table
  //   $(_row).after(appointmentBuildTableRow());

  //   // Remove old appointment row
  //   $(_row).remove();

  //   // Clear form fields
  //   formClear();

  //   // Change Update Button Text
  //   $("#CancelEditAppointmentButton").toggle();
  //   $("#CreateUpdateAppointmentButton").text("Submit Appointment");
  // }

  function formClear() {
    $("#firstName").val("");
    $("#lastName").val("");
    $("#inputMedication").val("");
    $("#inputStrength").val("");
    $("#inputAmount").val("");
    $("#inputDirections").val("");
    $("#inputStarttime").val("");
    $("#inputEndtime").val("");
  }

  function removeAppointment(ctl) {
    if (confirm('Do you want to delete appointment?')){
      selectedRow = $(ctl).parent().parent().attr("rx_id");
      DeleteAppointment({rx_id: null});
    }
  }

  function displayAppointment(ctl) {
    _row = $(ctl).parents("tr");
    var cols = _row.children("td");
    $("#firstName").val($(cols[0]).text());
    $("#lastName").val($(cols[1]).text());
    $("#inputMedication").val($(cols[2]).text());
    $("#inputStrength").val($(cols[3]).text());
    $("#inputAmount").val($(cols[4]).text());
    $("#inputDirections").val($(cols[5]).text());
    $("#inputStarttime").val(new Date($(cols[6]).text()).toLocaleDateString('en-CA'));
    $("#inputEndtime").val(new Date($(cols[7]).text()).toLocaleDateString('en-CA'));

    // Change Update Button Text\
    $("#CancelEditAppointmentButton").show();
    $("#CreateUpdateAppointmentButton").text("Update");

    console.log($(ctl));
    console.log($(ctl).parent().parent().attr("rx_id"));
    selectedRow = $(ctl).parent().parent().attr("rx_id");

  }

  var _row = null;

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
        } else if ($("#CreateUpdateAppointmentButton").text() == "Update"){

          console.log("updating appointment from form");
          UpdateAppointment(AppointmentDataObject);
        }

  });

  refreshAppointmentTable();
}

async function AddAppointment(JSONObject){
  if(JSONObject['fname'] && JSONObject['lname']){
    JSONObject['pat_name'] = JSONObject['fname'] + " " + JSONObject['lname'];
  }
  if(JSONObject['rx_end'] == ""){
    JSONObject['rx_end'] = null;
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

async function UpdateAppointment(JSONObject){
  if(JSONObject['fname'] && JSONObject['lname']){
    JSONObject['pat_name'] = JSONObject['fname'] + " " + JSONObject['lname'];
  }
  if(JSONObject['rx_end'] == ""){
    JSONObject['rx_end'] = null;
  }
  if(selectedRow){
    JSONObject['rx_id'] = selectedRow;
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
    alert("Successfully updated Appointment!")
    console.log(body);
    refreshAppointmentTable();
  });
}

async function DeleteAppointment(JSONObject){
  if(selectedRow){
    JSONObject['rx_id'] = selectedRow;
  }
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
    if(row.rx_start){
      row.rx_start = new Date(row.rx_start).toLocaleDateString();
    }
    if(row.rx_end){
      row.rx_end = new Date(row.rx_end).toLocaleDateString();
    } else {
      row.rx_end = '';
    }
  }
  return body;
}

function updateAppointmentTableUI(body){

  $("#appointmentTable tbody").empty();

  for (const row of body){
    
    $("#appointmentTable tbody").append(`<tr rx_id=${row.rx_id}>` +
      "<td>" + row.fname + "</td>" +
      "<td>" + row.lname + "</td>" +
      "<td>" + row.med_name + "</td>" +
      "<td>" + row.rx_strength + "</td>" +
      "<td>" + row.rx_amount + "</td>" +
      "<td>" + row.rx_desc + "</td>" +
      "<td>" + row.rx_start + "</td>" +
      "<td>" + row.rx_end + "</td>" +
      "<td>" + "<button class='btn btn-lg btn-primary btn-block' onclick='displayAppointment(this);''><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-pencil' viewBox='0 0 16 16'><path d='M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.7                 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z'/></svg></button>" + "</td>" +
      "<td>" + "<button class='btn btn-lg btn-primary btn-block' onclick='removeAppointment(this);''><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-trash' viewBox='0 0 16 16'><path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z'/><path fill-rule='evenodd' d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z'/></svg></button>" + "</td>" +
      "</tr>");
  }
}