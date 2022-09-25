// This urlBase must be changed to our domain, once our domain is working correctly
const urlBase = 'http://www.professorcontacts.com/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

// When the enter button was pressed, jump to the doLogin function
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
	var hash = md5(password);

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
	var tmp = {userName:userName,password:hash};
	//let tmp = {userName:userName, password:password};
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



/*============================================*/
/*=============== LANDING PAGE ===============*/
/*============================================*/

/* ---- TOGGLE SIDEBAR ---- */
const body = document.querySelector("body"),
  sidebar = body.querySelector("nav"),
  toggle = body.querySelector(".toggle");

toggle.addEventListener("click", () => {
  sidebar.classList.toggle("close");
});


/* ---- MODAL (POP-UP CONTACT FORM) ---- */
function addClicked(){
	// Set the onclick function to addContact();
	document.getElementById('addContactButton').setAttribute( "onClick", "addContact()" );
	document.getElementById("addContactResult").innerHTML = "";
  edit = 0;
  document.getElementById('id01').style.display='block';
  
}

let edit = 0;		// edit == 1 (Edit button was clicked), edit == 0 (Add contact button was clicked)
let contactID = 0;	// Stores the contact ID 
let stopShowingEditContact = 0;
function editClicked(ID){
	contactID = ID;
	console.log("contactID : " + contactID);
	stopShowingEditContact = 0;
	
	// Set the onclick function to updateContact();
	document.getElementById('addContactButton').setAttribute( "onClick", "updateContact(contactID)" );
	document.getElementById("addContactResult").innerHTML = "";
	edit = 1;
  	document.getElementById('id01').style.display='block';
	
}

var modal = document.getElementById('id01');
// Show the contact form
window.onclick = function(event) {
	if (event.target == modal) {
		modal.style.display = "none";
	}

  	if (edit == 1 && stopShowingEditContact == 0){
		editContact();
	}
	else if (edit == 0){
		clearContactFormField();
		edit = 2;
  	}
}
/* ---- END OF MODAL (POP-UP CONTACT FORM) ---- */

/* =============== EDIT CONTACT ================= */
function editContact(){
	let tmp = {ID: contactID, userId: userId};
  	let jsonPayload = JSON.stringify( tmp );
	
  	let url = urlBase + '/getContact.' + extension;

  	let xhr = new XMLHttpRequest();
  	xhr.open("POST", url, true);
  	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  	try
  	{
  		xhr.onreadystatechange = function()
  		{
  			if (this.readyState == 4 && this.status == 200)
  			{
				document.getElementById("addContactResult").innerHTML = "";
				let jsonObject = JSON.parse( xhr.responseText );
				// GET THE RESULT FROM THE DATABASE
				let contactList = jsonObject.results;
				console.log(contactList[0].firstName);

				// GET THE DETAILS FROM THE JSON OBJECT
				let oldFirstName = contactList[0].firstName;
				let oldLastName = contactList[0].lastName;
				let oldPhoneNumber = contactList[0].phoneNumber;
				let oldEmail = contactList[0].email;
				let oldStreetAddress = contactList[0].streetAddress;
				let oldCity = contactList[0].city;
				let oldState = contactList[0].state;
				let oldZip = contactList[0].zip;
				let contactId = contactList[0].ID;

				// Input is not required
				if (oldEmail == " " || oldStreetAddress == " " || oldCity == " " || oldState == " " || oldZip == " "){
					if (oldEmail == " "){
						oldEmail = "";
					}
					if (oldStreetAddress == " "){
						oldStreetAddress = "";
					}
					if (oldCity == " "){
						oldCity = "";
					}
					if (oldState == " ") {
						oldState = "";
					}
					if (oldZip == " "){
						oldZip = "";
					}
				}

				// POPULATE THE INPUT FIELDS
				document.getElementById("firstName").value = oldFirstName;
				document.getElementById("lastName").value = oldLastName;
				document.getElementById("phoneNumber").value = oldPhoneNumber;
				document.getElementById("emailAddress").value = oldEmail;
				document.getElementById("streetAddress").value = oldStreetAddress;
				document.getElementById("city").value = oldCity;
				document.getElementById("state").value = oldState;
				document.getElementById("zip").value = oldZip;

				addContactButton.innerText = 'Update Contact';
			}
		};
		xhr.send(jsonPayload);
  	}
  	catch(err)
  	{
  		document.getElementById("addContactResult").innerHTML = err.message;
  	}
}

function updateContact(contactID){
	stopShowingEditContact = 1;	// Removes the bug of calling editContacts() even though we want to update
	console.log("UPDATE CONTACT: " + contactID);
	// Get the inputs
	let first = document.getElementById("firstName").value;
	let last = document.getElementById("lastName").value;
	let email = document.getElementById("emailAddress").value;
	let phone = document.getElementById("phoneNumber").value;
	let address = document.getElementById("streetAddress").value;
	let city = document.getElementById("city").value;
	let state = document.getElementById("state").value;
	let zip = document.getElementById("zip").value;

	console.log(zip);

	document.getElementById("addContactResult").innerHTML = "";

	
	// --------- CHECK USER INPUT -----------//
	// Only check if first, last name, and phone fields is not empty
	if(first == "" || last == "" || phone == ""){
		document.getElementById("addContactResult").innerHTML = "One of the required* fields is incomplete";
		document.getElementById("addContactResult").style.color = '#E02745';
		return;
	}

	// If they put an email, check if it is a valid ID
	if (email != "" && !validEmail(email)){
		document.getElementById("addContactResult").innerHTML = "Email not supported";
		document.getElementById("addContactResult").style.color = '#E02745';
		return;
	}

	// Validate Zip
	if (zip != "" && !validZip(zip)){
		document.getElementById("addContactResult").innerHTML = "Please enter a valid zip";
		document.getElementById("addContactResult").style.color = '#E02745';
		return;
	}

	// Validate the phone number	
	if (!validPhone(phone)){
		document.getElementById("addContactResult").innerHTML = "Please enter a valid phone number (digits only, no space)";
		document.getElementById("addContactResult").style.color = '#E02745';
		return;
	}
	formated_phone = "("+phone.substring(0,3)+")"+phone.substring(3,6)+"-"+phone.substring(6,11)
	

	//* --------- CONNECT TO THE DATABASE THRU API -----------*/
  	let tmp = {userId: userId, firstName:first, lastName:last, email:email, phoneNumber:phone, streetAddress:address, city:city, state:state, zip:zip, ID: contactID};
  	let jsonPayload = JSON.stringify( tmp );

	
  	let url = urlBase + '/updateContact.' + extension;

  	let xhr = new XMLHttpRequest();
  	xhr.open("POST", url, true);
  	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  	try
  	{
  		xhr.onreadystatechange = function()
  		{
  			if (this.readyState == 4 && this.status == 200)
  			{
				document.getElementById("addContactResult").innerHTML = "Contact successfully updated!";
				document.getElementById("addContactResult").style.color = 'green';
				
				showTable();	// Show added contact to the table
			}
		};
		xhr.send(jsonPayload);
  	}
  	catch(err)
  	{
  		document.getElementById("addContactResult").innerHTML = err.message;
  	}
}


function clearContactFormField(){
	// Clear input fields
	document.getElementById("firstName").value = "";
	document.getElementById("lastName").value = "";
	document.getElementById("phoneNumber").value = "";
	document.getElementById("emailAddress").value = "";
	document.getElementById("streetAddress").value = "";
	document.getElementById("city").value = "";
	document.getElementById("state").value = "";
	document.getElementById("zip").value = "";

	addContactButton.innerText = 'Add Contact';
}
/* =============== END OF EDIT CONTACT ================= */

/* =============== ADD CONTACT ================= */
function addContact()
{
	// Get the inputs
	let first = document.getElementById("firstName").value;
	let last = document.getElementById("lastName").value;
	let email = document.getElementById("emailAddress").value;
	let phone = document.getElementById("phoneNumber").value;
	let address = document.getElementById("streetAddress").value;
	let city = document.getElementById("city").value;
	let state = document.getElementById("state").value;
	let zip = document.getElementById("zip").value;

	console.log(zip);

	document.getElementById("addContactResult").innerHTML = "";

	//* --------- CHECK USER INPUT -----------*/
	// Only check if first, last name, and phone fields is not empty
	if(first == "" || last == "" || phone == ""){
		document.getElementById("addContactResult").innerHTML = "One of the required* fields is incomplete";
		document.getElementById("addContactResult").style.color = '#E02745';
		return;
	}

	// If they put an email, check if it is a valid ID
	if (email != "" && !validEmail(email)){
		document.getElementById("addContactResult").innerHTML = "Email not supported";
		document.getElementById("addContactResult").style.color = '#E02745';
		return;
	}

	// Validate Zip
	if (zip != "" && !validZip(zip)){
		document.getElementById("addContactResult").innerHTML = "Please enter a valid zip";
		document.getElementById("addContactResult").style.color = '#E02745';
		return;
	}

	// Validate the phone number	
	if (!validPhone(phone)){
		document.getElementById("addContactResult").innerHTML = "Please enter a valid phone number (digits only, no space)";
		document.getElementById("addContactResult").style.color = '#E02745';
		return;
	}
	formated_phone = "("+phone.substring(0,3)+")"+phone.substring(3,6)+"-"+phone.substring(6,11)
	console.log(formated_phone);


	//* --------- CONNECT TO THE DATABASE THRU API -----------*/
  	let tmp = {userId: userId, firstName:first, lastName:last, email:email, phoneNumber:formated_phone, streetAddress:address, city:city, state:state, zip:zip};
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
				
				showTable();	// Show added contact to the table
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
	var phoneRe = /^\d{10}$/;
	return phoneRe.test(p);
  }

  function validZip(zip) {
	var isValidZip = /^(?:\d{5})?$/.test(zip);
	return isValidZip;
 }
/* =============== END OF ADD CONTACT ================= */

/* =============== DELETE CONTACT ================= */
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
/* =============== END OF DELETE CONTACT ================= */

/*=============== DISPLAY CONTACTS TO THE TABLE ===============*/
/*---- LAZY LOADING IMPLEMENTED, LOADS 13 CONTACTS ONLY UNLESS REQUESTED ----*/
let contactList = [];
let stopIndex = 0;
let remainingContacts = 0;

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

				var Table = document.getElementById("contactTable");
				Table.innerHTML = "<thead><tr></tr>";

				// Insert the header for the table
				setHeader();
				
				// Get the results from the database
				contactList = jsonObject.results;
				// Sort the resort by first name (ascending order)
				contactList = contactList.sort(function(a, b) {
					return compareStrings(a.firstName, b.firstName);
				})

				// Insert data to the table
				var html = "";
				// Populate table
				remainingContacts = contactList.length;		// Tracks the remaining contacts

				// Implement Lazy Load
				if(contactList.length > 13){
					html = lazyLoad(contactList);
					// Show load more button
					let element = document.getElementById("js-lazy-load");
					element.removeAttribute("hidden");
				}
				// No lazy loading required
				else{
					html = normalLoad(contactList)
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

// No lazy loading required
function normalLoad(contactList){
	var html = document.getElementById("contactTable").innerHTML
	for( let i=0; i<contactList.length; i++ )
	{
		row = appendRow(contactList, i)
		// get the current table body html as a string, and append the new row
		html += row;
	}
	return html;
}

// Perform lazy loading
function lazyLoad(contactList){
	var html = document.getElementById("contactTable").innerHTML

	for( let i=0; i<13; i++ )
	{
		row = appendRow(contactList, i)
		// get the current table body html as a string, and append the new row
		html += row;
		stopIndex = i;
		
		remainingContacts--;
	}
	console.log("stopIndex: " + stopIndex);
	return html;
}

// Insert contacts to the table
function appendRow(contactList, i){
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
						"<svg class='iconTable' onclick='editClicked(" + contactList[i].ID + ");'>"+
						"<use xlink:href='#icon-edit'></use>"+
					"</label>"+
					"<label> </label>"+
					"<label for='deleteContact'>"+
						"<svg class='iconTable' href = '#' onclick='editClicked(this);'>"+
						"<use xlink:href='#icon-delete'></use>"+
					"</label>"+
				"</td>";

	var row = "";
	row += '<tr><td>' + fullName + '</td><td>' + phoneNumber + '</td><td>' + email + '</td><td>' + address + edit;

	return row;
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

/*========== LAZY LOADING ==================*/
$(function(){
	$('#js-lazy-load').click(function () {
		let i = stopIndex;
		let counter = 0;
		while(i < contactList.length && counter < 13){
			console.log('stopIndex: ' +i );
			console.log('contactList.length: ' +contactList.length );
			console.log("Counter: " + counter);


			if (contactList[i].streetAddress == "" || contactList[i].city == "" || contactList[i].state == "" || contactList[i].zip == ""){
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
								"<svg class='iconTable' onclick='editClicked(" + contactList[i].ID + ");'>"+
								"<use xlink:href='#icon-edit'></use>"+
							"</label>"+
							"<label> </label>"+
							"<label for='deleteContact'>"+
								"<svg class='iconTable' href = '#' onclick='editClicked(this);'>"+
								"<use xlink:href='#icon-delete'></use>"+
							"</label>"+
						"</td>";

			var row = "";
			row += '<tr><td>' + fullName + '</td><td>' + phoneNumber + '</td><td>' + email + '</td><td>' + address + edit;

			$('#contactTable tbody').append(row);
			i++;
			counter++;
			stopIndex= i;
			
			remainingContacts--;
			
		}
		// Hide the load more button
		if(remainingContacts < 9){
			let element = document.getElementById("js-lazy-load");
			element.setAttribute("hidden", "hidden");
			console.log("Remaining: " + remainingContacts);
			
		}
	});
});
/*=============== END OF DISPLAY CONTACTS TO THE TABLE ===============*/

function searchContacts()
{	
	let srch = document.getElementById("searchQueryInput").value;
	console.log(srch);
	let searchList = [];

	let tmp = {search:srch,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/searchContact.' + extension;
	
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

				var Table = document.getElementById("contactTable");
				Table.innerHTML = "<thead><tr></tr>";

				// Insert the header for the table
				setHeader();
				
				// Get the results from the database
				searchList = jsonObject.results;
				// Sort the resort by first name (ascending order)
				searchList = searchList.sort(function(a, b) {
					return compareStrings(a.firstName, b.firstName);
				})

				// Insert data to the table
				var html = "";
				// Populate table
				remainingContacts = searchList.length;		// Tracks the remaining contacts

				// Implement Lazy Load
				if(searchList.length > 13){
					html = lazyLoad(contactList);
					// Show load more searchList
					let element = document.getElementById("js-lazy-load");
					element.removeAttribute("hidden");
				}
				// No lazy loading required
				else{
					html = normalLoad(searchList)
				}
				// set the table body to the new html code
				document.getElementById("contactTable").innerHTML = html;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
	
}