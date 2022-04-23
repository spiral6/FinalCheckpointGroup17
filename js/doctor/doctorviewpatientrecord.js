appointmentDataObject = [];
selectedRow = null;

  window.onload = async function() { 

    const patientRecordButton = document.getElementById('viewpatientrecord_button');
    if(patientRecordButton){
        patientRecordButton.addEventListener('click', () => {
            getPatientRecord($( "#patient_select option:selected" ).text());
        });
    }
    CreatePrescriptionForm = document.querySelector("form[name=create_patient_record]");
    CreatePrescriptionForm.addEventListener('submit', function(e) {
        e.preventDefault();  
        CreatePrescriptionFormData = new FormData(document.querySelector("form[name=create_patient_record]"));
        var PrescriptionDataObject = {}
        for (var pair of CreatePrescriptionFormData.entries()) {
          PrescriptionDataObject[pair[0]] = pair[1];
        }
        console.log(PrescriptionDataObject);
        if($("#submit_patient_record_button").text() == "Submit a Patient Record") {
          console.log("submitting patient record from form");
          AddPatientRecord(PrescriptionDataObject);
        }

  });

  getPatient();
}

async function AddPatientRecord(JSONObject){
    const request = await fetch(window.location.origin + '/doctor/db/patientRecord',  {
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
        alert("Successfully added patient record!")
        console.log(body);
        getPatientRecord(JSONObject['pat_name']);
      });
}


function updatePatientRecordUI(body){

  $("#recordTable tbody").empty();

  for (const row of body){
      row.rec_admit = new Date(row.rec_admit).toLocaleString()
      row.rec_leave = new Date(row.rec_leave).toLocaleString()
    
    $("#recordTable tbody").append(`<tr rec_id=${row.rec_id}>` +
      "<td>" + row.staff_name + "</td>" +
      "<td>" + row.rec_treatment + "</td>" +
      "<td>" + row.rec_admit + "</td>" +
      "<td>" + row.rec_leave + "</td>" +
      "<td>" + "<button class='btn btn-lg btn-primary btn-block' onclick='removePatientRecord(this);''><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-trash' viewBox='0 0 16 16'><path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z'/><path fill-rule='evenodd' d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z'/></svg></button>" + "</td>" +
      "</tr>");
  }
}

function removePatientRecord(ctl){
    if (confirm('Do you want to delete patient record?')){
        console.log($(ctl));
        selectedRow = $(ctl).parent().parent().attr("rec_id");
        console.log(selectedRow);
        DeletePatientRecord({rec_id: selectedRow});
    }
}

async function DeletePatientRecord(JSONObject){
    const request = await fetch(window.location.origin + '/doctor/db/patientRecord',  {
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
        alert("Successfully deleted Prescription!")
        console.log(body);
        getPatientRecord($( "#patient_select option:selected" ).text());
      });
}

async function getPatient(){
  const response = await fetch(window.location.origin + '/doctor/db/findPatient',  {
    method: 'get',
    headers: {
        'Content-Type': 'application/json'
    },
    // body: JSON.stringify({pat_name: pat_name})
  }).then(response => {
    if (!response.ok) {
      response.text().then(err => {
        alert(`HTTP error: ${response.status} \n${JSON.parse(err).text}`);
      })  
    }
    return response.text();
  }).then(body => {
    // alert("Successfully retrieved Appointment!")
    console.log("successfully retrieved patient list");
    console.log(body);
    body = JSON.parse(body);
    updatePatientSelect(body);
    // refreshAppointmentTable();
  });
}

async function getPatientRecord(pat_name){
    const response = await fetch(window.location.origin + '/doctor/db/patientRecord?pat_name=' + pat_name,  {
      method: 'get',
      headers: {
          'Content-Type': 'application/json'
      },
    //   body: JSON.stringify({pat_name: pat_name})
    }).then(response => {
      if (!response.ok) {
        response.text().then(err => {
          alert(`HTTP error: ${response.status} \n${JSON.parse(err).text}`);
        })  
      }
      return response.text();
    }).then(body => {
      // alert("Successfully retrieved Appointment!")
      console.log("successfully retrieved patient record");
      console.log(body);
      body = JSON.parse(body);
      updatePatientRecordUI(body);
      // refreshAppointmentTable();
    });
  }

function updatePatientSelect(body){

  $("#patient_select").empty();

  for (const row of body){
    console.log(row);
    $("#patient_select").append("<option>" + row.pat_name + "</option>");
  }

}