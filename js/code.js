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
	//var hash = md5(password);

	document.getElementById("loginResult").innerHTML="";


	// Checks if the userName and password field was left empty
	if ((userName == "") || (password == "")) {
        document.getElementById("loginResult").innerHTML = "All fields required";
		document.getElementById("loginResult").style.color = '#E02745';
        return;
    }

	// This will create a JSON string, which will be useful when retrieving a data from the database
	// These names are case sensitive make sure to match the reference to the php file

	// Hashing
	//var tmp = {userName:userName,password:hash};
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

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}


function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++)
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}

	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		let fullName = firstName + " " + lastName;
		const capitalFullName = fullName.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());

		document.getElementById("helloMessage").innerHTML = "Hello " + capitalFullName;
	}
}


/* =============== ADD CONTACT ================= */
function addContact()
{
	let first = document.getElementById("firstName").value;
	let last = document.getElementById("lastName").value;

	let email = document.getElementById("emailAddress").value;
	let phone = document.getElementById("phoneNumber").value;

	let address = document.getElementById("streetAddress").value;
	let city = document.getElementById("city").value;
	let state = document.getElementById("state").value;
	let zip = document.getElementById("zip").value;

	//* --------- CHECK USER INPUT -----------*/
	//if (email != ""// Only check if first, last name, and phone fields is not empty
	if(first == "" || last == "" || phone == ""){
		document.getElementById("addContactResult").innerHTML = "One of the required fields is incomplete";
		document.getElementById("addContactResult").style.color = '#E02745';
		return;
	}

	// If they put an email, check if it is a valid ID
	if (email != "" && !validEmail(email)){
		document.getElementById("addContactResult").innerHTML = "Email not supported";
		document.getElementById("loginResult").style.color = '#E02745';
		return;
	}

	// Validate Zip
	if (zip != "" && validZip(zip)){
		document.getElementById("addContactResult").innerHTML = "Please enter a valid zip";
		document.getElementById("addContactResult").style.color = '#E02745';
		return;
	}

	// Validate the phone number	
	if (!validPhone(phone)){
		document.getElementById("addContactResult").innerHTML = "Please enter a valid phone number";
		document.getElementById("addContactResult").style.color = '#E02745';
		return;
	}

	// Input is not required
	if (email == "" || address == "" || city == "" || state == "" || zip == ""){
		if (email == ""){
			email = " ";
		}
		if (address == ""){
			address = " ";
		}
		if (city == ""){
			city = " ";
		}
		if (state == "") {
			state = " ";
		}
		if (zip == ""){
			zip = " ";
		}
	}

  	let tmp = {userId: userId, firstName:first, lastName:last, email:email, phoneNumber:phone, streetAddress:address, city:city, state:state, zip:zip};
  	let jsonPayload = JSON.stringify( tmp );

	
  	let url = urlBase + '/addContact.' + extension;

  	let xhr = new XMLHttpRequest();
  	xhr.open("POST", url, true);
  	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  	try
  	{
  		xhr.onreadystatechange = function()
  		{
  			if (this.readyState == 4 && this.status == 200)
  			{
				document.getElementById("addContactResult").innerHTML = "Contact successfully added!";
				document.getElementById("addContactResult").style.color = 'green';
				// Show it to the table
				addToTable(first, last, phone, email, address, city, state, zip);
			}
		};
		xhr.send(jsonPayload);
  	}
  	catch(err)
  	{
  		document.getElementById("addContactResult").innerHTML = err.message;
  	}
}

function validEmail(e) {
    var filter = /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/;
    return String(e).search (filter) != -1;
}

function validPhone(p) {
	var phoneRe = /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/;
	var digits = p.replace(/\D/g, "");
	return phoneRe.test(digits);
  }

  function validZip(zip) {
	return /^\d{5}(-\d{4})?$/.test(zip);
 }

 function addToTable(firstName, lastName, phoneNumber, email, streetAddress, city, state, zip){
	var html = document.getElementById("contactTable").innerHTML

	var fullName = firstName + " " + lastName;
	var phoneNumber = phoneNumber;
	var email = email;

	if ( streetAddress == " " || city == " " || state == " " || zip == " "){
		var address = streetAddress + " " + city + " " + state + " " + zip;
	}
	else {
		var address = streetAddress + ", " + city + ", " + state + " " + zip;				
	}

	var edit = "<td>"+
					"<label for='editContact'>"+
						"<svg class='iconTable' onclick='editClicked();'>"+
						"<use xlink:href='#icon-edit'></use>"+
					"</label>"+
					"<label> </label>"+
					"<label for='deleteContact'>"+
						"<svg class='iconTable' href = '#' onclick='deleteClicked();'>"+
						"<use xlink:href='#icon-delete'></use>"+
					"</label>"+
				"</td>";

	var row = "";
	row += '<tr><td>' + fullName + '</td><td>' + phoneNumber + '</td><td>' + email + '</td><td>' + address + edit;

	html += row;

	document.getElementById("contactTable").innerHTML = html;
}
/* =============== END OF ADD CONTACT ================= */


function deleteContact(contactID)
{
	console.log(contactID);
	let flag = window.confirm('Delete this contact?');
	if(!flag){
		return;
	}
	let tmp = {ID:contactID};
	let jsonPayload = JSON.stringify( tmp );
	let url = urlBase + '/DeleteContact.' + extension;
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				console.log("deleted ID"+contactID);
				window.location.reload();
			}
		};
		xhr.send(jsonPayload);

	}
	catch(err)
	{
		console.log(err);
	}
}

/*=============== LANDING PAGE ===============*/
let edit = 0;
function editClicked(){
  edit = 1;
  document.getElementById('id01').style.display='block';
}

function addClicked(){
  edit = 0;
  document.getElementById('id01').style.display='block';
}

/* ---- TOGGLE SIDEBAR ---- */
const body = document.querySelector("body"),
  sidebar = body.querySelector("nav"),
  toggle = body.querySelector(".toggle");

toggle.addEventListener("click", () => {
  sidebar.classList.toggle("close");
});

/*=============== MODAL (POP-UP CONTACT FORM) ===============*/
var modal = document.getElementById('id01');
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }

  if (edit == 1){
    var table = document.getElementById('mytable');

    let firstName = table.rows[1].cells[0].innerHTML;
    let phone = table.rows[1].cells[1].innerHTML;
    let email = table.rows[1].cells[2].innerHTML;
    let address = table.rows[1].cells[3].innerHTML;
    let city = table.rows[1].cells[4].innerHTML;
    let state = table.rows[1].cells[5].innerHTML;
    let zip = table.rows[1].cells[6].innerHTML;

    document.getElementById("firstName").value = firstName;
    document.getElementById("lastName").value = firstName;
    document.getElementById("phoneNumber").value = phone;
    document.getElementById("emailAddress").value = email;
    document.getElementById("streetAddress").value = address;
    document.getElementById("city").value = city;
    document.getElementById("state").value = state;
    document.getElementById("zip").value = zip;

    addContact.innerText = 'Update Contact';
  }
  else if (edit == 0){
    document.getElementById("firstName").value = "";
    document.getElementById("lastName").value = "";
    document.getElementById("phoneNumber").value = "";
    document.getElementById("emailAddress").value = "";
    document.getElementById("streetAddress").value = "";
    document.getElementById("city").value = "";
    document.getElementById("state").value = "";
    document.getElementById("zip").value = "";

    addContact.innerText = 'Add Contact';
    edit=2;
  }
}


/*=============== DISPLAY CONTACTS TO THE TABLE ===============*/
function showTable(){
	let tmp = {userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/displayContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				let jsonObject = JSON.parse( xhr.responseText );

				// Insert the header for the table
				setHeader();
				
				// Get the results from the database
				contactList = jsonObject.results;
				// Sort the resort by first name (ascending order)
				contactList.sort(function(a, b) {
					return compareStrings(a.firstName, b.firstName);
				})

				// Insert data to the table
				var html = document.getElementById("contactTable").innerHTML
				// Populate table
				for( let i=0; i<jsonObject.results.length; i++ )
				{
					if ((contactList[i].streetAddress == " " || contactList[i].city == " " || contactList[i].state == " " || contactList[i].zip == " ") ||
						(contactList[i].streetAddress == "" || contactList[i].city == "" || contactList[i].state == "" || contactList[i].zip == "")){
						var address = contactList[i].streetAddress + " " + contactList[i].city + " " + contactList[i].state + " " + contactList[i].zip;
					}
					else {
						var address = contactList[i].streetAddress + ", " + contactList[i].city + ", " + contactList[i].state + " " + contactList[i].zip;			
					}

					var fullName = contactList[i].firstName + " " + contactList[i].lastName;
					var phoneNumber = contactList[i].phoneNumber;
					var email = contactList[i].email;
					
					var edit = "<td>"+
									"<label for='editContact'>"+
										"<svg class='iconTable' onclick='editClicked();'>"+
										"<use xlink:href='#icon-edit'></use>"+
									"</label>"+
									"<label> </label>"+
									"<label for='deleteContact'>"+
										"<svg class='iconTable' href = '#' onclick='deleteClicked();'>"+
										"<use xlink:href='#icon-delete'></use>"+
									"</label>"+
								"</td>";

					var row = "";
					row += '<tr><td>' + fullName + '</td><td>' + phoneNumber + '</td><td>' + email + '</td><td>' + address + edit;

					// get the current table body html as a string, and append the new row
					html += row;

				}
				// set the table body to the new html code
				document.getElementById("contactTable").innerHTML = html;

			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}

}

function addToTable(firstName, lastName, phoneNumber, email, streetAddress, city, state, zip){
	var html = document.getElementById("contactTable").innerHTML

	

	var fullName = firstName + " " + lastName;
	var phoneNumber = phoneNumber;
	var email = email;

	if ( streetAddress == " " || city == " " || state == " " || zip == " "){
		var address = streetAddress + " " + city + " " + state + " " + zip;
	}
	else {
		var address = streetAddress + ", " + city + ", " + state + " " + zip;				
	}

	var edit = "<td>"+
					"<label for='editContact'>"+
						"<svg class='iconTable' onclick='editClicked();'>"+
						"<use xlink:href='#icon-edit'></use>"+
					"</label>"+
					"<label> </label>"+
					"<label for='deleteContact'>"+
						"<svg class='iconTable' href = '#' onclick='deleteClicked();'>"+
						"<use xlink:href='#icon-delete'></use>"+
					"</label>"+
				"</td>";

	var row = "";
	row += '<tr><td>' + fullName + '</td><td>' + phoneNumber + '</td><td>' + email + '</td><td>' + address + edit;

	html += row;

	document.getElementById("contactTable").innerHTML = html;
}

// INSERT HEADERS TO THE TABLE
function setHeader() {
	var tr = document.getElementById('contactTable').tHead.children[0];
	tr.insertCell(0).outerHTML = "<th width = 15%>Name</th>";
	tr.insertCell(1).outerHTML = "<th width = 13%>Phone</th>";
	tr.insertCell(2).outerHTML = "<th width = 25%>Email</th>";
	tr.insertCell(3).outerHTML = "<th width = 40%>Address</th>";
	tr.insertCell(4).outerHTML = "<th width = 7%></th>";
}

// SORT BY FIRST NAME
function compareStrings(a, b) {
	a = a.toLowerCase();
	b = b.toLowerCase();

	return (a < b) ? -1 : (a > b) ? 1 : 0;
}
