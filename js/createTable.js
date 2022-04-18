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
        td.innerHTML = alias[key];
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
            td = document.createElement('td');
            tr.appendChild(td);
            td.innerHTML = row_data[key];
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
    pat_height: "Patient Height",
    pat_weight: "Patient Weight",
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
    schedule_workday: "Schedule Workday"
}