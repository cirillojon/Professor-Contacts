<?php
	$inData = getRequestInfo();
    // Get the data from frontend and store the inputs here
    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $emailAddress = $inData["email"];
    $phoneNumber = $inData["phoneNumber"];
    $streetAddress = $inData["streetAddress"];
    $city = $inData["city"];
    $state = $inData["state"];
    $zip = $inData["zip"];
    $userId = $inData["userId"];

    // Establish a connection to the database
	$conn = new mysqli("localhost", "User1", "COP4331", "Group26");
	if ($conn->connect_error)
	{
		returnWithError($conn->connect_error );
	}
	else
	{
		// Fetch the contact from the database then update it using the inputs from the user. 
        // The userId must match to the one that the user was trying to update
        $query = "UPDATE contacts SET firstName=?, lastName=?, email=?, phoneNumber=?, streetAddress=?, city=?, state=?, zip=? WHERE userId=?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("ssssssssi", $firstName, $lastName, $emailAddress, $phoneNumber, $streetAddress, $city, $state, $zip, $userId);
        // Execute the command
        $stmt->execute();

        // Close the database connection
        $stmt->close();
        $conn->close();

        returnWithError("SUCCESSFUL, NO ERRORS");
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}

    function returnWithError( $err )
    {
      $retValue = '{"error":"' . $err . '"}';
      sendResultInfoAsJson( $retValue );
    }

?>
