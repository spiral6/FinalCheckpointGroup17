async function findPatient() {
    const searchQuery = document.getElementById('findPatientSearchBar').text;
    const response = await fetch(window.location.origin + '/doctor/db/findPatient?' + searchQuery,  {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.text()
    ).then(body => {
        // console.log(JSON.parse(body));
        document.getElementById("findPatientResults").innerHTML = JSON.stringify(body)
    })
}

window.onload = function() { 
    // document.getElementById("doctortable_getdescbutton").onclick = getDesc
    // document.getElementById("doctortable_getselect").onclick = getSelect
    
    // DoctorForm = document.querySelector("form[name=DoctorForm]")
    // DoctorForm.addEventListener('submit', function(e) {
    //     e.preventDefault()
    //     console.log("Submitting doctor form...");
    //     DoctorFormData = new FormData(document.querySelector("form[name=DoctorForm]"));
    //     // console.log(DoctorFormData);
    //     // console.log(DoctorFormData.get("doctor_id"))
    //     // console.log(Array.from(DoctorFormData.keys()))
    //     var DoctorFormDataObject = {}
    //     for (var pair of DoctorFormData.entries()) {
    //         DoctorFormDataObject[pair[0]] = pair[1];
    //     }
    //     // console.log(DoctorFormDataObject);
    //     putInsert(DoctorFormDataObject);
    // })
};
