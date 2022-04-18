// async function findPatient() {
//     const searchQuery = document.getElementById('findPatientSearchBar').text;
//     const response = await fetch(window.location.origin + '/doctor/db/findPatient?' + searchQuery,  {
//         method: 'get',
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     }).then(response => response.text()
//     ).then(body => {
//         // console.log(JSON.parse(body));
//         document.getElementById("findPatientResults").innerHTML = JSON.stringify(body)
//     })
// }