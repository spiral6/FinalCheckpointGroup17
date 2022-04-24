var _row = null;
var selectedRow = null;

window.onload = function() { 

    const patientInfoTable = document.querySelector("form[name=edit_patient_form]");
    if(patientInfoTable){
        patientInfoTable.addEventListener('submit', function(e) {
            e.preventDefault();  

            UpdatePatientFormData = new FormData(document.querySelector("form[name=edit_patient_form]"));
            var UpdatePatientDataObject = {}
            for (var pair of UpdatePatientFormData.entries()) {
                UpdatePatientDataObject[pair[0]] = pair[1];
            }

            if($("#CreateUpdatePatientInformation").text() == "Create Patient") {
              createPatient(UpdatePatientDataObject);
            } else if ($("#CreateUpdatePatientInformation").text() == "Update Patient"){
              updatePatient(UpdatePatientDataObject);
            }
      });
      refreshPatientForm();
    }

    const locationInfoTable = document.querySelector("form[name=edit_location_form]");
    if(locationInfoTable){
      locationInfoTable.addEventListener('submit', function(e) {
            e.preventDefault();  
            
            UpdateLocationFormData = new FormData(document.querySelector("form[name=edit_location_form]"));
            var UpdateLocationDataObject = {}
            for (var pair of UpdateLocationFormData.entries()) {
                UpdateLocationDataObject[pair[0]] = pair[1];
            }
            console.log(UpdateLocationDataObject);

            if($("#CreateUpdateClinicInformation").text() == "Create Clinic") {
              createLocation(UpdateLocationDataObject);
            } else if ($("#CreateUpdateClinicInformation").text() == "Update Clinic"){
              updateLocation(UpdateLocationDataObject);
            }
      });
      refreshLocationForm();
    }

    const staffInfoTable = document.querySelector("form[name=edit_staff_form]");
    if(staffInfoTable){
      staffInfoTable.addEventListener('submit', function(e) {
            e.preventDefault();  
            
            UpdateStaffFormData = new FormData(document.querySelector("form[name=edit_staff_form]"));
            var UpdateStaffDataObject = {}
            for (var pair of UpdateStaffFormData.entries()) {
                UpdateStaffDataObject[pair[0]] = pair[1];
            }
            console.log(UpdateStaffDataObject);

            if($("#CreateUpdateStaffInformation").text() == "Create Staff") {
              createStaff(UpdateStaffDataObject);
            } else if ($("#CreateUpdateStaffInformation").text() == "Update Staff"){
              updateStaff(UpdateStaffDataObject);
            }
      });
      refreshStaffForm();
    }

    const reportDates = $("#report_dates");
    if(reportDates){
      const report2button = document.getElementById("report2button");
      const report3button = document.getElementById("report3button");
      report2button.addEventListener('click', function(e) {
        e.preventDefault();  
        const dates = {date_start: $("#date_start").val(), date_end: $("#date_end").val()};
        // console.log(dates);
        if (Date.parse(dates["date_start"]) > Date.parse(dates["date_end"])) {
          alert("Beginning date is greater than end date!");
        } else {
          getReport2(dates);
        }
      });
      report3button.addEventListener('click', function(e) {
        e.preventDefault();  
        const dates = {date_start: $("#date_start").val(), date_end: $("#date_end").val()};
        if (Date.parse(dates["date_start"]) > Date.parse(dates["date_end"])) {
          alert("Beginning date is greater than end date!");
        } else {
          getReport3(dates);
        }
      });
    }

}

  function patientFormClear() {
    $("#pat_id").val("");
    $("#pat_name").val("");
    $("#pat_sex").val("");
    $("#pat_email").val("");
    $("#pat_phone").val("");
    $("#pat_pcp").val("");
    $("#pat_DoB").val("");
    $("#pat_allergy").val("");
    $("#pat_insurance").val("");
    $("#pat_address").val("");

    // $("#pat_id").attr('readonly', true);
    // $("#pat_name").attr('readonly', true);
    // $("#pat_sex").attr('disabled', true);
    // $("#pat_email").attr('readonly', true);
    // $("#pat_phone").attr('readonly', true);
    // $("#pat_DoB").attr('readonly', true);
    // $("#pat_allergy").attr('readonly', true);
    // $("#pat_address").attr('readonly', true);
    // $("#pat_insurance").attr('readonly', true);
    // $("#pat_pcp").attr('readonly', true);

    $("#CancelPatientInformation").hide();
    $("#CreateUpdatePatientInformation").text("Create Patient");
  }

  function removePatient(ctl) {
    if (confirm('Do you want to delete patient?')){
      selectedRow = $(ctl).parent().parent().attr("pat_id");
      deletePatient({pat_id: selectedRow});
    }
  }

  function editPatient(ctl) {
    _row = $(ctl).parents("tr");
    var cols = _row.children("td");
    $("#pat_id").val($(ctl).parent().parent().attr("pat_id"));
    $("#pat_name").val($(cols[0]).text());
    $("#pat_sex").val($(cols[1]).text()).trigger('change');
    $("#pat_email").val($(cols[2]).text());
    $("#pat_phone").val($(cols[3]).text());
    $("#pat_DoB").val(new Date($(cols[4]).text()).toLocaleDateString('en-CA'));
    $("#pat_allergy").val($(cols[5]).text());
    $("#pat_address").val($(cols[6]).text());
    $("#pat_insurance").val($(cols[7]).text());
    $("#pat_pcp").val(($(cols[8]).text()));

    // $("#pat_id").attr('readonly', false);
    $("#pat_name").attr('readonly', false);
    $("#pat_sex").attr('disabled', false);
    $("#pat_email").attr('readonly', false);
    $("#pat_phone").attr('readonly', false);
    $("#pat_DoB").attr('readonly', false);
    $("#pat_allergy").attr('readonly', false);
    $("#pat_address").attr('readonly', false);
    $("#pat_insurance").attr('readonly', false);
    $("#pat_pcp").attr('readonly', false);

    // Change Update Button Text\
    $("#CancelPatientInformation").show();
    $("#CreateUpdatePatientInformation").text("Update Patient");

    console.log($(ctl));
    console.log($(ctl).parent().parent().attr("pat_id"));
    selectedRow = $(ctl).parent().parent().attr("pat_id");
  }

  async function createPatient(JSONObject){
    console.log(JSONObject);
    const request = await fetch(window.location.origin + '/staff/db/patient',  {
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
        alert("Successfully created patient!")
        console.log(body);
        refreshPatientForm();
      });
  }

  async function updatePatient(JSONObject){
    const request = await fetch(window.location.origin + '/staff/db/patient',  {
        method: 'post',
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
        alert("Successfully updated patient!")
        console.log(body);
        refreshPatientForm();
      });
  }

  async function deletePatient(JSONObject){
    const request = await fetch(window.location.origin + '/staff/db/patient',  {
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
        alert("Successfully updated patient!")
        console.log(body);
        refreshPatientForm();
      });
  }

  async function refreshPatientForm(){
    const request = await fetch(window.location.origin + '/staff/db/patient',  {
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
        body = JSON.parse(body);
        refreshPatientTableUI(body);
      });
  }

  function refreshPatientTableUI(body){

    $("#editpatient_table tbody").empty();
  
    for (const row of body){

      $("#editpatient_table tbody").append(`<tr pat_id=${row.pat_id}>` +
        "<td>" + row.pat_name + "</td>" +
        "<td>" + row.pat_sex + "</td>" +
        "<td>" + row.pat_email + "</td>" +
        "<td>" + row.pat_phone + "</td>" +
        "<td>" + new Date(row.pat_DoB).toLocaleDateString() + "</td>" +
        "<td>" + row.pat_allergy + "</td>" +
        "<td>" + row.pat_address + "</td>" +
        "<td>" + row.pat_insurance + "</td>" +
        "<td>" + row.pat_pcp + "</td>" +
        "<td>" + "<button class='btn btn-lg btn-primary btn-block' onclick='editPatient(this);''><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-pencil' viewBox='0 0 16 16'><path d='M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.7                 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z'/></svg></button>" + "</td>" +
        "<td>" + "<button class='btn btn-lg btn-primary btn-block' onclick='removePatient(this);''><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-trash' viewBox='0 0 16 16'><path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z'/><path fill-rule='evenodd' d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z'/></svg></button>" + "</td>" +
        "</tr>");
    }
  }

  function locationFormClear() {
    $("#loc_id").val("");
    $("#loc_name").val("");
    $("#loc_dep").val("");
    $("#loc_address").val("");

    // $("#loc_id").attr('readonly', true);
    // $("#loc_name").attr('readonly', true);
    // $("#loc_dep").attr('readonly', true);
    // $("#loc_address").attr('readonly', true);
 
    $("#CancelClinicInformation").hide();
    $("#CreateUpdateClinicInformation").text("Create Clinic");

  }

  function removeLocation(ctl) {
    if (confirm('Do you want to delete location?')){
      selectedRow = $(ctl).parent().parent().attr("loc_id");
      deleteLocation({loc_id: selectedRow});
    }
  }

  function editLocation(ctl) {
    _row = $(ctl).parents("tr");
    var cols = _row.children("td");
    $("#loc_id").val($(ctl).parent().parent().attr("loc_id"));
    $("#loc_name").val($(cols[0]).text());
    $("#loc_address").val($(cols[1]).text());
    $("#loc_dep").val($(cols[2]).text());


    // $("#pat_id").attr('readonly', false);
    $("#loc_name").attr('readonly', false);
    $("#loc_dep").attr('readonly', false);
    $("#loc_address").attr('readonly', false);

    // Change Update Button Text\
    $("#CancelClinicInformation").show();
    $("#CreateUpdateClinicInformation").text("Update Clinic");

    console.log($(ctl));
    console.log($(ctl).parent().parent().attr("loc_id"));
    selectedRow = $(ctl).parent().parent().attr("loc_id");
  }

  async function createLocation(JSONObject){
    const request = await fetch(window.location.origin + '/staff/db/clinic',  {
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
        alert("Successfully created location!")
        console.log(body);
        refreshLocationForm();
      });
  }

  async function updateLocation(JSONObject){
    const request = await fetch(window.location.origin + '/staff/db/clinic',  {
        method: 'post',
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
        alert("Successfully updated location!")
        console.log(body);
        refreshLocationForm();
      });
  }

  async function deleteLocation(JSONObject){
    const request = await fetch(window.location.origin + '/staff/db/clinic',  {
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
        alert("Successfully deleted location!")
        console.log(body);
        refreshLocationForm();
      });
  }

  async function refreshLocationForm(){
    const request = await fetch(window.location.origin + '/staff/db/clinic',  {
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
        body = JSON.parse(body);
        refreshLocationTableUI(body);
      });
  }

  function refreshLocationTableUI(body){

    $("#editpatient_table tbody").empty();
  
    for (const row of body){

      $("#editpatient_table tbody").append(`<tr loc_id=${row.loc_id}>` +
        "<td>" + row.loc_name + "</td>" +
        "<td>" + row.loc_address + "</td>" +
        "<td>" + row.loc_dep + "</td>" +
        "<td>" + "<button class='btn btn-lg btn-primary btn-block' onclick='editLocation(this);''><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-pencil' viewBox='0 0 16 16'><path d='M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.7                 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z'/></svg></button>" + "</td>" +
        "<td>" + "<button class='btn btn-lg btn-primary btn-block' onclick='removeLocation(this);''><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-trash' viewBox='0 0 16 16'><path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z'/><path fill-rule='evenodd' d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z'/></svg></button>" + "</td>" +
        "</tr>");
    }
  }

  function staffFormClear() {
    $("#staff_id").val("");
    $("#staff_name").val("");
    $("#staff_sex").val("");
    $("#staff_email").val("");
    $("#staff_phone").val("");
    $("#staff_pcp").val("");
    $("#staff_DoB").val("");
    $("#staff_address").val("");
    $("#staff_occupation").val("");
    $("#doc_specialty").val("");
    $("#doc_perms").val("");

    // $("#staff_id").attr('readonly', true);
    // $("#staff_name").attr('readonly', true);
    // $("#staff_sex").attr('disabled', true);
    // $("#staff_email").attr('readonly', true);
    // $("#staff_phone").attr('readonly', true);
    // $("#staff_DoB").attr('readonly', true);
    // $("#staff_allergy").attr('readonly', true);
    // $("#staff_address").attr('readonly', true);
    // $("#staff_insurance").attr('readonly', true);
    // $("#staff_pcp").attr('readonly', true);

    $("#CancelStaffInformation").hide();
    $("#CreateUpdateStaffInformation").text("Create Staff");
  }

  function removeStaff(ctl) {
    if (confirm('Do you want to delete staff?')){
      selectedRow = $(ctl).parent().parent().attr("staff_id");
      deleteStaff({staff_id: selectedRow});
    }
  }

  function editStaff(ctl) {
    _row = $(ctl).parents("tr");
    var cols = _row.children("td");
    $("#staff_id").val($(ctl).parent().parent().attr("staff_id"));
    $("#staff_name").val($(cols[0]).text());
    $("#staff_sex").val($(cols[1]).text()).trigger('change');
    $("#staff_email").val($(cols[2]).text());
    $("#staff_phone").val($(cols[3]).text());
    $("#staff_DoB").val(new Date($(cols[4]).text()).toLocaleDateString('en-CA'));
    $("#staff_occupation").val($(cols[5]).text());
    $("#doc_specialty").val($(cols[6]).text());
    $("#doc_perms").val($(cols[7]).text());
    $("#staff_address").val($(cols[8]).text());

    // $("#staff_id").attr('readonly', false);
    // $("#staff_name").attr('readonly', false);
    // $("#staff_sex").attr('disabled', false);
    // $("#staff_email").attr('readonly', false);
    // $("#staff_phone").attr('readonly', false);
    // $("#staff_DoB").attr('readonly', false);
    // $("#staff_allergy").attr('readonly', false);
    // $("#staff_address").attr('readonly', false);
    // $("#staff_insurance").attr('readonly', false);

    // Change Update Button Text\
    $("#CancelStaffInformation").show();
    $("#CreateUpdateStaffInformation").text("Update Staff");

    console.log($(ctl));
    console.log($(ctl).parent().parent().attr("staff_id"));
    selectedRow = $(ctl).parent().parent().attr("staff_id");
  }

  async function createStaff(JSONObject){
    console.log(JSONObject);
    const request = await fetch(window.location.origin + '/staff/db/staff',  {
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
        alert("Successfully created staff!")
        console.log(body);
        refreshStaffForm();
      });
  }

  async function updateStaff(JSONObject){
    const request = await fetch(window.location.origin + '/staff/db/staff',  {
        method: 'post',
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
        alert("Successfully updated staff!")
        console.log(body);
        refreshStaffForm();
      });
  }

  async function deleteStaff(JSONObject){
    const request = await fetch(window.location.origin + '/staff/db/staff',  {
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
        alert("Successfully updated staff!")
        console.log(body);
        refreshStaffForm();
      });
  }

  async function refreshStaffForm(){
    const request = await fetch(window.location.origin + '/staff/db/staff',  {
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
        body = JSON.parse(body);
        refreshStaffTableUI(body);
      });
  }

  function refreshStaffTableUI(body){

    $("#editstaff_table tbody").empty();
  
    for (const row of body){

      $("#editstaff_table tbody").append(`<tr staff_id=${row.staff_id}>` +
        "<td>" + row.staff_name + "</td>" +
        "<td>" + row.staff_sex + "</td>" +
        "<td>" + row.staff_email + "</td>" +
        "<td>" + row.staff_phone + "</td>" +
        "<td>" + new Date(row.staff_DoB).toLocaleDateString() + "</td>" +
        "<td>" + row.staff_occupation + "</td>" +
        "<td>" + row.doc_specialty + "</td>" +
        "<td>" + row.doc_perms + "</td>" +
        "<td>" + row.staff_address + "</td>" +
        "<td>" + "<button class='btn btn-lg btn-primary btn-block' onclick='editStaff(this);''><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-pencil' viewBox='0 0 16 16'><path d='M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.7                 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z'/></svg></button>" + "</td>" +
        "<td>" + "<button class='btn btn-lg btn-primary btn-block' onclick='removeStaff(this);''><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-trash' viewBox='0 0 16 16'><path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z'/><path fill-rule='evenodd' d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z'/></svg></button>" + "</td>" +
        "</tr>");
    }
  }

  async function getReport2(JSONObject){    
      const request = await fetch(window.location.origin + '/staff/db/report2?date_start=' + JSONObject["date_start"] + '&date_end=' + JSONObject["date_end"],  {
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
        console.log(body);
        // body = JSON.parse(body);
        document.getElementById("report2_results").innerHTML = createTable(JSON.parse(body)).innerHTML;
        document.getElementById("report2_results").className = "table";
      });
  }

  async function getReport3(JSONObject){
    const request = await fetch(window.location.origin + '/staff/db/report3?date_start=' + JSONObject["date_start"] + '&date_end=' + JSONObject["date_end"],  {
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
      // body = JSON.parse(body);
      document.getElementById("report3_results").innerHTML = createTable(JSON.parse(body)).innerHTML;
      document.getElementById("report3_results").className = "table";
    });
  }

  function createTable(table_data) {
    var table = document.createElement('table'), tr, td, row, cell;
    table.className = "table";

    //Create inital header row for table - Shamee
    row_header = table_data[0]
    thead = document.createElement('thead');
    tr = document.createElement('tr');

    for (key in row_header){
            td = document.createElement('td');
            tr.appendChild(td);
            td.innerHTML = key;
    }
    thead.appendChild(tr);
    table.appendChild(thead);

    //Now fill in the rest of the data - Shamee
    tbody = document.createElement('tbody');
    for (row = 0; row < table_data.length; row++) {
        tr = document.createElement('tr');
        row_data = table_data[row];
        for (key in row_data){
          td = document.createElement('td');
          tr.appendChild(td);
          td.innerHTML = row_data[key];
        }
        tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    return table;
}