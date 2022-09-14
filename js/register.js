// This urlBase must be changed to our domain, once our domain is working correctly
const urlBase = 'http://159.223.160.41/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
let userName = "";
let loginPassword = "";
let repeatPassword = "";

// When the enter button was pressed, jump to the doRegister function
document.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        doRegister;
    }
});

function doRegister()
{
	userId = 0;
	
	// These variables must match the "id" part in the html
	firstName = document.getElementById("firstName").value;
	lastName = document.getElementById("lastName").value;
	userName = document.getElementById("userName").value;
	let password = document.getElementById("loginPassword").value;
	let repeatPassword = document.getElementById("repeatPassword").value;

	//document.getElementById("registerResult").innerHTML="";

	// Checks if there are any fields that are left empty
	if ((userName == "") || (password == "") || (firstName == "") || (lastName == "") || (repeatPassword == "")) {
        document.getElementById("registerResult").innerHTML = "All fields required";
		document.getElementById("registerResult").style.color = '#E02745';
        return;
    }

	// Check if the passwords match
	if (password != repeatPassword) {
		document.getElementById("registerResult").innerHTML = "Passwords do not match.";
		document.getElementById("registerResult").style.color = '#E02745';
		return;
	}


	let tmp = {userName:userName, password:password, firstName:firstName, lastName:lastName};
	let jsonPayload = JSON.stringify(tmp);

	// Path for the php file, the path name should be changed with every api endpoints
	let url = urlBase + '/register.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			// Registered succesfully 
			if (this.readyState == 4 && this.status == 200)			
			{
				let jsonObject= JSON.parse( xhr.responseText);
				error = jsonObject.error;

				if (error != ""){
					document.getElementById("registerResult").innerHTML = "Duplicate username";
					document.getElementById("registerResult").style.color = '#E02745';

					return;
				}
				
				document.getElementById("registerResult").innerHTML = "Successfully Registered Please Login";
				document.getElementById("registerResult").style.color = 'green';

				// Clear all the fields
				document.getElementById("firstName").value = "";
     			document.getElementById("lastName").value = "";
				document.getElementById("userName").value = "";
				document.getElementById("loginPassword").value = "";
				document.getElementById("repeatPassword").value = "";

				return;
			}

		};
		xhr.send(jsonPayload);
	}
	// Register not successful 
	catch(err)
	{
		document.getElementById("registerResult").innerHTML= err.message;
		document.getElementById("registerResult").style.color = '#E02745';
	}

}
