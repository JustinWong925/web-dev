//Userlist data array for filling in info box
var userListData = [];

//DOM Ready ========================================
$(document).ready(function(){
    // Populate user table on intial page load
    populateTable();

    //username link click
    $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

    //add user button
    $('#btnAddUser').on('click', addUser);

    //add delete user link click
    $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);

});





// FUNCTIONS==========================================
function populateTable() {
    //empty content string
    var tableContent = '';

    //jQuery AJAX call for JSON
    $.getJSON('/users/userlist', function (data) {
        //bring all returned user data into our global variable so we dont have to call database everytime
        userListData = data;

        //for each item in our JSON, add a table row and cells to the content string
        $.each(data, function () {
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        //inject whole content string into our existing HTML table
        $('#userList table tbody').html(tableContent);
    });
};


// Show User Info
function showUserInfo(event) {
    // Prevent Link from Firing

    // Retrieve username from link rel attribute
    var thisUserName = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = userListData.map(function (arrayItem) { return arrayItem.username; }).indexOf(thisUserName);

    // Get our User Object
    var thisUserObject = userListData[arrayPosition];

    //Populate Info Box
    $('#userInfoName').text(thisUserObject.fullname);
    $('#userInfoAge').text(thisUserObject.age);
    $('#userInfoGender').text(thisUserObject.gender);
    $('#userInfoLocation').text(thisUserObject.location);

};



function addUser(event) {
    event.preventDefault();

    //basic validation - count errors if fields are blank
    var errorCount = 0;
    $('#addUser input').each(function (index, val) {
        if ($(this).val() === '') { errorCount++; }
    });

    if (errorCount === 0) {
        // If no errors, compile all user info into one object
        var newUser = {
            'username': $('#addUser fieldset input#inputUserName').val(),
            'email': $('#addUser fieldset input#inputUserEmail').val(),
            'fullname': $('#addUser fieldset input#inputUserFullname').val(),
            'age': $('#addUser fieldset input#inputUserAge').val(),
            'location': $('#addUser fieldset input#inputUserLocation').val(),
            'gender': $('#addUser fieldset input#inputUserGender').val()
        }
        // Use AJAX to post object to adduser service
        $.ajax({
            type: 'POST',
            data: newUser,
            url: 'users/adduser',
            dataType: 'JSON'
        }).done(function (response) {
            //check for successful response (should be blank)
            if (response.msg === '') {
                //clear form inputs
                $('#addUser fieldset input').val('');
                //update table
                populateTable();
            } else {
                //if error, alert error message that service returned
                alert('Error: ' + response.msg);
            }
        });

    } else {
        //if error count is > 0 error out
        alert("Please fill in all fields");
        return false;
    }
};

function deleteUser(event) {
    event.preventDefault();

    //pop up delete confirmation
    var confirmation = confirm("Are you sure you wish to delete this user?");

    //check to see if user confirmed
    if (confirmation === true) {
        $.ajax({
            type: 'DELETE',
            url: 'users/deleteuser/' + $(this).attr('rel')
        }).done(function (response) {
            //check for successful (blank response)
            if (response.msg === '') {
                //update Table
                console.log("removing user");
                populateTable();
            }
            else {
                alert("Error: " + response.msg);
            }
        });
    } else {
        //if not confirmed
        return false;
    }
};


