// This urlBase must be changed to our domain, once our domain is working correctly
const urlBase = 'http://www.professorcontacts.com/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

// When the enter button was pressed, jump to the doRegister function
document.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        doLogin;
    }
});

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";

	// These variables must match the "id" part in the html
	let userName = document.getElementById("username").value;
	let password = document.getElementById("loginPassword").value;

	document.getElementById("loginResult").innerHTML="";


	// Checks if the userName and password field was left empty
	if ((userName == "") || (password == "")) {
        document.getElementById("loginResult").innerHTML = "All fields required";
		document.getElementById("loginResult").style.color = '#E02745';
        return;
    }

	// This will create a JSON string, which will be useful when retrieving a data from the database
	// These names are case sensitive make sure to match the reference to the php file 

	// Look at the line 19 in the login.php 
	// $stmt->bind_param("ss", $inData["userName"], $inData["password"]);
	let tmp = {userName:userName, password:password};
	let jsonPayload = JSON.stringify(tmp);

	// Path for the php file, the path name should be changed with every api endpoints
	let url = urlBase + '/login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse(xhr.responseText);
				userId = jsonObject.ID;
				
				// Username and password is incorrect
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					document.getElementById("loginResult").style.color = '#E02745';
					return;
				}

				// Login successfully 
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;
				
				saveCookie();
				
				// Redirect to the main page, "color.html" is just a place holder for our actual main page
				window.location.href = "color.html";
			}
			
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}


function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}
