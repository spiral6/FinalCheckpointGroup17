async function signOut(){
    
    const response = await fetch('/logout', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect:'follow'
    }).then(response => {
            if(response.status === 200){
                alert("You have been signed out.")
                window.location.href = "/";
            } else {
                alert("Unknown error.")
            }
            //response.text()
        }
    )

}

window.addEventListener("load", function() { 
    document.getElementById("signout").onclick = signOut
});