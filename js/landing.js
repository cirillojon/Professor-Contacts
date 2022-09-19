let edit = 0;
function editClicked(){
  edit = 1;
  document.getElementById('id01').style.display='block';
} 

function addClicked(){
  edit = 0;
  document.getElementById('id01').style.display='block';
}

/* TOGGLE */
const body = document.querySelector("body"),
  sidebar = body.querySelector("nav"),
  toggle = body.querySelector(".toggle");

toggle.addEventListener("click", () => {
  sidebar.classList.toggle("close");
});

/* MODAL */
/* EDIT MODAL */
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



