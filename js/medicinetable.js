function createTable(table_data) {
    var table = document.createElement('table'), tr, td, row, cell;

    //Create inital header row for table - Shamee
    row_header = table_data[0]
    tr = document.createElement('tr');
    for (key in row_header){
        td = document.createElement('td');
        tr.appendChild(td);
        td.innerHTML = key;
    }
    table.appendChild(tr);

    //Now fill in the rest of the data - Shamee
    for (row = 0; row < table_data.length; row++) {
        tr = document.createElement('tr');
        row_data = table_data[row];
        for (key in row_data){
            td = document.createElement('td');
            tr.appendChild(td);
            td.innerHTML = row_data[key];
        }
        table.appendChild(tr);
    }
    return table;
}

async function getDesc() {
    const response = await fetch(window.location.origin + '/medicine/db/desc', {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    ).then(response => response.text()
    ).then(body => {
        console.log(JSON.parse(body));
        document.getElementById("medicinetable_desc").innerHTML = JSON.stringify(body)
    })
}

async function getSelect() {
    const response = await fetch(window.location.origin + '/medicine/db/select', {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    ).then(response => response.text()
    ).then(body => {
        console.log(JSON.stringify(body));
        table_data = JSON.parse(body)
        var table = document.createElement('table'), tr, td, row, cell;
        if(table_data !== []){
            table = createTable(table_data);
        document.getElementById("medicinetable_select").innerHTML = table.outerHTML
        }
    })
}

async function putInsert(JSONObj) {
    // MedicineForm = document.querySelector("form[name=MedicineForm]")
    // MedicineForm.querySelector("button").addEventListener('click', function() {
    //     MedicineForm.requestSubmit();
    // })
    // MedicineForm.addEventListener('submit', function(e) {
    //     e.preventDefault()
    //     console.log("Submitting doctor form...");
    //     for (var pair of MedicineForm.entries()) {
    //         console.log(pair[0] + ': ' + pair[1]);
    //     }
    // })
    console.log("JSON OBJECT");
    console.log(JSONObj);
    console.log("END JSON OBJECT");
    const response = await fetch(window.location.origin + '/medicine/db/insert', {
        method: 'put',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(JSONObj)
    }).then(response => response.text())
}

window.onload = function() { 
    document.getElementById("medicinetable_getdescbutton").onclick = getDesc
    document.getElementById("medicinetable_getselect").onclick = getSelect
    
    // const FD = new FormData( document.querySelector("form[name=MedicineForm]") );
    MedicineForm = document.querySelector("form[name=MedicineForm]")
    MedicineForm.addEventListener('submit', function(e) {
        e.preventDefault()
        // console.log("Submitting doctor form...");
        MedicineFormData = new FormData(document.querySelector("form[name=MedicineForm]"));
        // console.log(MedicineFormData);
        // console.log(MedicineFormData.get("doctor_id"))
        // console.log(Array.from(MedicineFormData.keys()))
        var MedicineFormDataObject = {}
        for (var pair of MedicineFormData.entries()) {
            MedicineFormDataObject[pair[0]] = pair[1];
        }
        // console.log(MedicineFormDataObject);
        putInsert(MedicineFormDataObject);
    })
    // MedicineForm.querySelector("input[id=MedicineFormsubmit]").addEventListener('click', function() {
    //     MedicineForm.requestSubmit();
    // })
    

};


