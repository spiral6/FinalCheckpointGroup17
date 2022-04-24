var _row = null;
var selectedRow = null;

window.onload = function() { 

    const patientInfoTable = document.querySelector("form[name=edit_patient_form]");
    if(patientInfoTable){
        patientInfoTable.addEventListener('submit', function(e) {
            e.preventDefault();  
            if(! ($("#pat_id").val() == "")){
                UpdatePatientFormData = new FormData(document.querySelector("form[name=edit_patient_form]"));
                var UpdatePatientDataObject = {}
                for (var pair of UpdatePatientFormData.entries()) {
                    UpdatePatientDataObject[pair[0]] = pair[1];
                }
                console.log(UpdatePatientDataObject);
                updatePatient(UpdatePatientDataObject);
            }
      });
      refreshPatientForm();
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

    $("#pat_id").attr('readonly', true);
    $("#pat_name").attr('readonly', true);
    $("#pat_sex").attr('disabled', true);
    $("#pat_email").attr('readonly', true);
    $("#pat_phone").attr('readonly', true);
    $("#pat_DoB").attr('readonly', true);
    $("#pat_allergy").attr('readonly', true);
    $("#pat_address").attr('readonly', true);
    $("#pat_insurance").attr('readonly', true);
    $("#pat_pcp").attr('readonly', true);

    $("#CancelPatientInformation").hide();
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

    console.log($(ctl));
    console.log($(ctl).parent().parent().attr("pat_id"));
    selectedRow = $(ctl).parent().parent().attr("pat_id");
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