<?php
	$inData = getRequestInfo();

	// Establish connection to the database
	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "Group26");
	if ($conn->connect_error)
	{
		returnWithError($conn->connect_error );
	}
	else
	{
        // Get the contact ID of the person the user wants to delete
        $contactId = $inData["contactId"];
        $firstName = $inData["firstName"];
        $lastName = $inData["lastName"];

		// Create a delete query to delete a contact by looking for the contactID
		$deleteQuery = 'DELETE FROM contacts WHERE firstName = ? AND lastName = ? And contactId = ?';
		// Delete the contact from the database
		$stmt = $conn->prepare($deleteQuery);
		$stmt->bind_param("ssi", $firstName, $lastName, $contactId);
		$stmt->execute();
		
		// Close the connection
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

	function returnWithError($err)
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
?>
