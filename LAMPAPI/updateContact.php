<?php
	$inData = getRequestInfo();

    // Establish a connection to the database
	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error)
	{
		returnWithError($conn->connect_error );
	}
	else
	{
        // Get the data from frontend and store the inputs here
        $firstName = $inData["firstName"];
        $lastName = $inData["lastName"];
        $emailAddress = $inData["emailAddress"];
        $phoneNumber = $inData["phoneNumber"];
        $streetAddress = $inData["streetAddress"];
        $city = $inData["city"];
        $state = $inData["state"];
        $zip = $inData["zip"];
        $contactId = $inData["contactId"];

		// Fetch the contact from the database then update it using the inputs from the user. 
        // The contactId must match to the one that the user was trying to update
        $query = "UPDATE contacts SET firstName=?, lastName=?, email=?, phoneNumber=?, streetAddress=?, city=?, state=?, zip=? WHERE contactId=?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("ssssssssss",$firstName,$lastName,$emailAddress,$phoneNumber,$streetAddress,$city,$state,$zip,$contactId);
        // Execute the command
        $stmt->execute();

        // Close the database connection
        $stmt->close();
        $conn->close();

        returnWithError("");
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
