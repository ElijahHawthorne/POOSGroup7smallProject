const urlBase = 'http://poosgroup7small.com/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin()
{
	event.preventDefault(); // Prevent the form from submitting and refreshing the page
	
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	console.log(jsonPayload)				// test json format
	let url = urlBase + '/Login.' + extension;

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
				userId = jsonObject.id;
				
				
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
				
				// Call readCookie and loadContacts after successful login
                //readCookie();
                //loadContacts();
				
				window.location.href = "mainpage.html";
			}
		};
		

		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
		console.log(err)
	}
}

function doRegister() {	
	event.preventDefault();			//stops page refresh
	console.log("inside do register");
	 let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let login = document.getElementById("userName").value;
    let password = document.getElementById("password").value;

	let tmp = {
		FirstName: firstName, 
		LastName: lastName, 
		Login: login, 
		Password: password
	};

	console.log(tmp);
	let jsonPayload = JSON.stringify( tmp);
	console.log("New user registered..." + jsonPayload);		//test whats sent to API
	let url = urlBase + '/Registration.' + extension;
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);

	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        // Define the response handler
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);

                // Handle success or error responses
                if (jsonObject.error === "") {
                    document.getElementById("registerResult").innerHTML = "Registration successful!";
                } else {
                    document.getElementById("registerResult").innerHTML = "Error: " + jsonObject.error;
                }
            }
        };
        // Send the JSON payload to the server
        xhr.send(jsonPayload);
    } catch (err) {
		console.log(err);
        document.getElementById("registerResult").innerHTML = err.message;
    }
}


function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "=firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
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
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
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



// Function to search contacts
function searchContacts() {
	
    let searchTerm = document.getElementById("searchText").value;  // Get the search term
    document.getElementById("contactSearchResult").innerHTML = "";  // Clear previous search result status
    document.getElementById("contactsTableBody").innerHTML = "";  // Clear previous table results

		console.log(userId);

    let tmp = { search: searchTerm, userId: userId };  // Assume you have a user ID from a cookie/session
    let jsonPayload = JSON.stringify(tmp);  // Create the payload for the API request

    let url = urlBase + '/SearchContacts.' + extension;  // URL of the PHP search API

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);  // Open a POST request
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");  // Set content type for JSON

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);  // Parse the response JSON
					
                if (jsonObject.error) {
                    // Display error if no contacts found
					
                    document.getElementById("contactSearchResult").innerHTML = jsonObject.error;
                } else {
                    // Process and render the contacts in the table
                    let results = jsonObject.results;  // Get the list of contacts
					console.log(results.length);
                    if (results.length > 0) {
                        results.forEach(contact => {
                            // Create a new table row for each contact
                            let row = document.createElement("tr");

                            // Create and append table data cells for each contact field
                            let firstNameCell = document.createElement("td");
                            firstNameCell.innerHTML = contact.FirstName;
                            row.appendChild(firstNameCell);

                            let lastNameCell = document.createElement("td");
                            lastNameCell.innerHTML = contact.LastName;
                            row.appendChild(lastNameCell);

                            let emailCell = document.createElement("td");
                            emailCell.innerHTML = contact.Email;
                            row.appendChild(emailCell);

                            let phoneCell = document.createElement("td");
                            phoneCell.innerHTML = contact.Phone;
                            row.appendChild(phoneCell);

                            // Add an Actions column with buttons (you can add functionality later)
                            let actionsCell = document.createElement("td");
                            actionsCell.innerHTML = "<button>Edit</button> <button>Delete</button>";
                            row.appendChild(actionsCell);

                            // Append the row to the table body
                            document.getElementById("contactsTableBody").appendChild(row);
                        });
                    } else {
                        document.getElementById("contactSearchResult").innerHTML = "No contacts found.";
                    }
                }
            }
        };
        xhr.send(jsonPayload);  // Send the request with the search payload
    } catch (err) {
        document.getElementById("contactSearchResult").innerHTML = "Error: " + err.message;  // Handle any errors
    }
}

function addContact() {
    
	readCookie();
	console.log("The user id is + " + userId);
	let firstName = document.getElementById("addfirstName").value;
    let lastName = document.getElementById("addlastName").value;
    let email = document.getElementById("addemail").value;
    let phone = document.getElementById("addphone").value;
   
    let tmp = { FirstName: firstName, LastName: lastName, Email: email, Phone: phone, UserID: userId };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/AddContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);

                if (jsonObject.error) {
                    document.getElementById("addContactResult").innerHTML = jsonObject.error;
                }else if(firstName==""||lastName==""||email==""||phone=="") {
                    document.getElementById("addContactResult").innerHTML = "Please fill out all fields.";
                    
                }else {
                    document.getElementById("addContactResult").innerHTML = "Contact added successfully!";
                    
                    loadContacts();
                    // Clear the input fields
                    document.getElementById("addfirstName").value = "";
                    document.getElementById("addlastName").value = "";
                    document.getElementById("addemail").value = "";
                    document.getElementById("addphone").value = "";
                }
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("addContactResult").innerHTML = err.message;
    }
}

function loadContacts(loadtype) {
    //let userId = 13; // Assume you have a user ID from a cookie/session

	readCookie();
    console.log("loading contacts..");


    let tmp = { userId: userId };
    let url = urlBase + '/GetContacts.' + extension;

    if(loadtype=='search'){
        tmp = {search: document.getElementById("searchText").value, userId: userId};
        url = urlBase + '/SearchContacts.' + extension;
    }
        


    let jsonPayload = JSON.stringify(tmp);

    
    

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);

                if (jsonObject.error) {
                    document.getElementById("contactSearchResult").innerHTML = jsonObject.error;
                } else {
                    let results = jsonObject.results;
                    let tableBody = document.getElementById("contactsTableBody");
                    tableBody.innerHTML = ""; // Clear existing content

                    results.forEach(contact => {
                        let row = document.createElement("tr");

                        let firstNameCell = document.createElement("td");
                        firstNameCell.innerHTML = contact.FirstName;
                        row.appendChild(firstNameCell);

                        let lastNameCell = document.createElement("td");
                        lastNameCell.innerHTML = contact.LastName;
                        row.appendChild(lastNameCell);

                        let emailCell = document.createElement("td");
                        emailCell.innerHTML = contact.Email;
                        row.appendChild(emailCell);

                        let phoneCell = document.createElement("td");
                        phoneCell.innerHTML = contact.Phone;
                        row.appendChild(phoneCell);

                        let actionsCell = document.createElement("td");
                        //actionsCell.innerHTML = `
                       //     <button class="button edit-button" >Edit</button>
                       //     <button class="button delete-button">Delete</button>
                       //`;
                        
                       let editButton = document.createElement("button");
                                editButton.classList.add("button", "edit-button");
                                editButton.innerHTML = "Edit";
                                editButton.setAttribute("data-contact-ID", contact.ContactID);
                                editButton.onclick = function() {
                                    let contactId = this.getAttribute("data-contact-ID");
                                    console.log("Edit button clicked for Contact ID:" + contactId);
                                    OpenPopup("update",contact);
                                };
                                actionsCell.appendChild(editButton);
                                let deleteButton = document.createElement("button");
                                deleteButton.classList.add("button", "delete-button");
                                deleteButton.innerHTML = "Delete";
                                deleteButton.setAttribute("data-contact-ID", contact.ContactID);
                                deleteButton.onclick = function() {
                                    let contactId = this.getAttribute("data-contact-ID");
                                    console.log("delete button clicked for Contact ID:" + contactId);
                                    OpenPopup("delete",contact);
                                };
                                actionsCell.appendChild(deleteButton);

                        row.appendChild(actionsCell);

                        tableBody.appendChild(row);
                    });
                }
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("contactSearchResult").innerHTML = "Error: " + err.message;
    }

}

function DeleteContact(ID) {
   
	readCookie();
		  	
    let tmp = { contactID: ID };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/DeleteContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);

                if (jsonObject.error) {
                    document.getElementById("addContactResult").innerHTML = jsonObject.error;
                }else {
                    document.getElementById("addContactResult").innerHTML = "Contact deleted successfully!";
                    
                    
                    loadContacts();
                    
                }
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("addContactResult").innerHTML = err.message;
    }
}

function UpdateContact(contact){

//readCookie();
let jsonPayload = JSON.stringify(contact);

    let url = urlBase + '/UpdateContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);

                if (jsonObject.error) {
                    document.getElementById("addContactResult").innerHTML = jsonObject.error;
                }else {
                    document.getElementById("addContactResult").innerHTML = "Contact editted successfully!";
                    
                    
                    loadContacts();
                    
                }
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("addContactResult").innerHTML = err.message;
    }
   


}

function OpenPopup(popupType,contact){



    if(popupType == "update"){
    document.getElementById("popupForm").innerHTML = `
    
    <div class="form-container">
    <form id="editForm">
        <h2>Edit Contact</h2>
        <label for="updateFirstName">First Name:</label>
        <input type="text" id="updateFirstName" name="firstName"><br><br>

        <label for="updateLastName">Last Name:</label>
        <input type="text" id="updateLastName" name="lastName"><br><br>

        <label for="updateEmail">Email:</label>
        <input type="email" id="updateEmail" name="email"><br><br>

        <label for="updatePhone">Phone:</label>
        <input type="text" id="updatePhone" name="phone"><br><br>

        <button type="button" id="saveButton">Save</button>
        <button type="button" id="closePopupButton">Close</button>
    </form>
</div> 
`;
document.getElementById("updateFirstName").value = contact.FirstName;
document.getElementById("updateLastName").value = contact.LastName;
document.getElementById("updateEmail").value = contact.Email;
document.getElementById("updatePhone").value = contact.Phone;

readCookie();


document.getElementById("closePopupButton").onclick = function(){
   
    
    ClosePopup();
}


document.getElementById("saveButton").onclick = function(){

    let updatedContact={
        inFirstName: document.getElementById("updateFirstName").value,
        inLastName: document.getElementById("updateLastName").value,
        inEmail: document.getElementById("updateEmail").value,
        inPhone: document.getElementById("updatePhone").value,
        UserID: userId,
        contactID: contact.ContactID
    }
    console.log("the updated phone is"+ updatedContact.inPhone+ "and contact number"+updatedContact.contactID+"is being updated");

   UpdateContact(updatedContact);
    ClosePopup();
}
    }else{


        document.getElementById("popupForm").innerHTML = `
    
        <div class="form-container">
        <form id="editForm">
            <h2 id="deleteConfirm"> </h2>

            <button type="button" id="saveButton">Yes, I am sure</button>
            <button type="button" id="closePopupButton">No, I change my mind</button>
        </form>
    </div> 
    `;

    document.getElementById("deleteConfirm").innerHTML = "Are you sure you want to remove "+contact.FirstName+" "+contact.LastName+" from your life forever?"

    document.getElementById("closePopupButton").onclick = function(){
   
    
        ClosePopup();
    }
    
    
    document.getElementById("saveButton").onclick = function(){
    
        
        
    
       DeleteContact(contact.ContactID);
        ClosePopup();
    }




    }


    document.getElementById("popupForm").style.display="flex";
}

function ClosePopup(){
    document.getElementById("popupForm").style.display="none";
}

document.addEventListener("DOMContentLoaded", function(){
	if(window.location.pathname.includes("mainpage.html")){
		loadContacts();
	}});

