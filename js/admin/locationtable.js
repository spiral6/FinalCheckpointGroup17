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
    const response = await fetch(window.location.origin + '/location/db/desc', {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    ).then(response => response.text()
    ).then(body => {
        console.log(JSON.parse(body));
        document.getElementById("locationtable_desc").innerHTML = JSON.stringify(body)
    })
}

async function getSelect() {
    const response = await fetch(window.location.origin + '/location/db/select', {
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
        document.getElementById("locationtable_select").innerHTML = table.outerHTML
        }
    })
}

async function putInsert(JSONObj) {
    // LocationForm = document.querySelector("form[name=LocationForm]")
    // LocationForm.querySelector("button").addEventListener('click', function() {
    //     LocationForm.requestSubmit();
    // })
    // LocationForm.addEventListener('submit', function(e) {
    //     e.preventDefault()
    //     console.log("Submitting doctor form...");
    //     for (var pair of LocationForm.entries()) {
    //         console.log(pair[0] + ': ' + pair[1]);
    //     }
    // })
    console.log("JSON OBJECT");
    console.log(JSONObj);
    console.log("END JSON OBJECT");
    const response = await fetch(window.location.origin + '/location/db/insert', {
        method: 'put',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(JSONObj)
    }).then(response => response.text())
}

window.onload = function() { 
    document.getElementById("locationtable_getdescbutton").onclick = getDesc
    document.getElementById("locationtable_getselect").onclick = getSelect
    
    // const FD = new FormData( document.querySelector("form[name=LocationForm]") );
    LocationForm = document.querySelector("form[name=LocationForm]")
    LocationForm.addEventListener('submit', function(e) {
        e.preventDefault()
        // console.log("Submitting doctor form...");
        LocationFormData = new FormData(document.querySelector("form[name=LocationForm]"));
        // console.log(LocationFormData);
        // console.log(LocationFormData.get("doctor_id"))
        // console.log(Array.from(LocationFormData.keys()))
        var LocationFormDataObject = {}
        for (var pair of LocationFormData.entries()) {
            LocationFormDataObject[pair[0]] = pair[1];
        }
        // console.log(LocationFormDataObject);
        putInsert(LocationFormDataObject);
    })
    // LocationForm.querySelector("input[id=LocationFormsubmit]").addEventListener('click', function() {
    //     LocationForm.requestSubmit();
    // })
    

};


