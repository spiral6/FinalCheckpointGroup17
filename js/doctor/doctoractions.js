function createTable(table_data) {
    var table = document.createElement('table'), tr, td, row, cell;
    table.className = "table";

    //Create inital header row for table - Shamee
    row_header = table_data[0]
    thead = document.createElement('thead');
    tr = document.createElement('tr');

    // td = document.createElement('td');
    // tr.appendChild(td);
    // td.innerHTML = "View Patient Info";

    for (key in row_header){
        if (key == "pat_id"){
            td = document.createElement('td');
            tr.appendChild(td);
            td.innerHTML = " ";
        } else {    
            td = document.createElement('td');
            tr.appendChild(td);
            if(alias[key]){
                td.innerHTML = alias[key];
            } else {
                td.innerHTML = key;
            }
        }

    }
    thead.appendChild(tr);
    table.appendChild(thead);
    // table.appendChild(tr);

    //Now fill in the rest of the data - Shamee
    tbody = document.createElement('tbody');
    for (row = 0; row < table_data.length; row++) {
        tr = document.createElement('tr');
        row_data = table_data[row];
        for (key in row_data){
            // console.log(key);
            if (key == "pat_id"){
                // button = document.createElement('button');
                // button.className = "btn btn-primary btn-block";
                // button.setAttribute('id', row_data['pat_id']);
                // button.innerHTML = "PatientInfo";
                // button.addEventListener('click', () => {
                //     viewPatientInfo(button.getAttribute('id'));
                // });
                // tr.appendChild(button);
                td = document.createElement('td');
                tr.appendChild(td);
                td.innerHTML = " ";
            } else if (key == "app_time" || key == "rec_admit" || key == "rec_leave") {
                td = document.createElement('td');
                tr.appendChild(td);
                const datetime = new Date(row_data[key]);
                td.innerHTML = datetime.toLocaleString();
            } else {
                td = document.createElement('td');
                tr.appendChild(td);
                td.innerHTML = row_data[key];
            }
        }
        tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    return table;
}

const alias = {
    pat_name: "Patient Name",
    pat_sex: "Patient Gender",
    pat_email: "Patient Email",
    pat_phone: "Patient Phone",
    pat_DoB: "Patient Date of Birth",
    pat_height: "Patient Height (in inches)",
    pat_weight: "Patient Weight (in lbs)",
    pat_allergy: "Patient Allergy",
    pat_insurance: "Patient Insurance",
    pat_address: "Patient Address",
    pat_pcp: "Patient Primary Care Physician",
    staff_name: "Staff Name",
    staff_sex: "Staff Gender",
    staff_email: "Staff Email",
    staff_phone: "Staff Phone",
    staff_salary: "Staff Salary",
    staff_occupation: "Staff Occupation",
    doc_specialty: "Doctor Specialty",
    doc_permissions: "Doctor Permissions",
    loc_city: "Clinic Location",
    loc_name: "Clinic Name",
    loc_dep: "Clinic Department",
    schedule_workday: "Schedule Workday",
    rec_treatment: "Treatment",
    rec_admit: "Patient Enter Date",
    rec_leave: "Patient Leave Date"
}

async function findPatient() {

    const searchInput = document.getElementById('patient_search')
    const inputValue = searchInput.value;
    const searchQuery = inputValue;
    const response = await fetch(window.location.origin + '/doctor/db/findPatient?q=' + searchQuery,  {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.text()
    ).then(body => {
        console.log(createTable(JSON.parse(body)))
        document.getElementById("findpatient_results").innerHTML = createTable(JSON.parse(body)).innerHTML;
        document.getElementById("findpatient_results").className = "table";
    })
}

async function viewPatientInfo(id) {

    // console.log("view patient info")
    // console.log(id)

    const response = await fetch(window.location.origin + '/doctor/db/patientInfo?pat_id=' + id,  {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
        // body: JSON.stringify(id)
    }).then(response => response.text()
    ).then(body => {
        console.log(JSON.parse(body))
        document.getElementById("patient_info_results").innerHTML = createTable(JSON.parse(body)).innerHTML;
        document.getElementById("patient_info_results").className = "table";
    })
}

async function viewPayroll() {
    const response = await fetch(window.location.origin + '/doctor/db/payroll',  {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.text()
    ).then(body => {
        console.log(createTable(JSON.parse(body)))
        document.getElementById("viewpayroll_results").innerHTML = createTable(JSON.parse(body)).innerHTML;
        document.getElementById("viewpayroll_results").className = "table";
    })
}

async function viewSchedule() {
    const response = await fetch(window.location.origin + '/doctor/db/schedule',  {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.text()
    ).then(body => {
        console.log(createTable(JSON.parse(body)))
        document.getElementById("viewschedule_results").innerHTML = createTable(JSON.parse(body)).innerHTML;
        document.getElementById("viewschedule_results").className = "table";
    })
}

async function viewPatientRecord(id) {
    const response = await fetch(window.location.origin + '/doctor/db/patientrecord?pat_id=' + id,  {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.text()
    ).then(body => {
        console.log(createTable(JSON.parse(body)))
        document.getElementById("viewpatientrecord_results").innerHTML = createTable(JSON.parse(body)).innerHTML;
        document.getElementById("viewpatientrecord_results").className = "table";
    })
}

window.onload = function() { 

    const searchButton = document.getElementById('patient_search_button')
    if(searchButton){
        searchButton.addEventListener('click', findPatient);
    }
    // searchButton.addEventListener('click', () => {
    //     const inputValue = searchInput.value;
    //     alert(inputValue);
    // });

    const viewPayrollButton = document.getElementById('viewpayroll_button')
    if(viewPayrollButton){
        viewPayrollButton.addEventListener('click', () => {
            viewPayroll()
        });
    }

    const viewScheduleButton = document.getElementById('viewschedule_button')
    if(viewScheduleButton){
        viewScheduleButton.addEventListener('click', () => {
            viewSchedule()
        });
    }

    const patientInfoButton = document.getElementById('patient_info_button');
    if(patientInfoButton){
        patientInfoButton.addEventListener('click', () => {
            viewPatientInfo(7777);
        });
    }

    const patientRecordButton = document.getElementById('viewpatientrecord_button');
    if(patientRecordButton){
        patientRecordButton.addEventListener('click', () => {
            viewPatientRecord(1111);
        });
    }

    // tr.appendChild(button);

    // const viewPayrollButton = document.getElementById('viewpayroll_button')
    // viewPayrollButton.addEventListener('click', () => {
    //     viewPayroll()
    // });

};