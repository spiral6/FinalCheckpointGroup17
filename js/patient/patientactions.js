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
        if (key == "pat_id" || key == "app_id"){
            td = document.createElement('td');
            tr.appendChild(td);
            td.innerHTML = " ";
        } else {    
            td = document.createElement('td');
            tr.appendChild(td);
            td.innerHTML = alias[key];
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
            if (key == "pat_id" || key == "pat_id"){
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
    app_time: "Appointment Time",
    app_id: ""
}

async function viewAppointments(id) {
    const response = await fetch(window.location.origin + '/patient/db/appointment?pat_id=' + id,  {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
        // body: JSON.stringify(id)
    }).then(response => response.text()
    ).then(body => {
        console.log(JSON.parse(body))
        document.getElementById("viewappointments_table").innerHTML = createTable(JSON.parse(body)).innerHTML;
        document.getElementById("viewappointments_table").className = "table";
    })
}

async function viewClinics(id) {
    const response = await fetch(window.location.origin + '/patient/db/clinic',  {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
        // body: JSON.stringify(id)
    }).then(response => response.text()
    ).then(body => {
        console.log(JSON.parse(body))
        document.getElementById("viewclinics_table").innerHTML = createTable(JSON.parse(body)).innerHTML;
        document.getElementById("viewclinics_table").className = "table";
    })
}

async function findDoctor() {

    const searchInput = document.getElementById('doctor_search')
    const inputValue = searchInput.value;
    const searchQuery = inputValue;
    const response = await fetch(window.location.origin + '/patient/db/findDoctor?doctor=' + searchQuery,  {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.text()
    ).then(body => {
        console.log(JSON.parse(body));
        document.getElementById("finddoctor_results").innerHTML = createTable(JSON.parse(body)).innerHTML;
        // document.getElementById("finddoctor_results").innerHTML = createTable(JSON.parse(body));
        document.getElementById("finddoctor_results").className = "table";
    })
}

window.onload = function() { 

    const searchButton = document.getElementById('doctor_search_button')
    if(searchButton){
        searchButton.addEventListener('click', findDoctor);
    }

    const viewAppointmentsButton = document.getElementById('viewappointments_button')
    if(viewAppointmentsButton){
        viewAppointmentsButton.addEventListener('click', () => {
            viewAppointments(1111);
        });
    }

    const viewClinicsButton = document.getElementById('viewclinics_button')
    if(viewClinicsButton){
        viewClinicsButton.addEventListener('click', () => {
            viewClinics(1111);
        });
    }
};
