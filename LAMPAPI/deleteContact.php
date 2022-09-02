<?php
	$inData = getRequestInfo();

	// Get the contact ID of the person the user wants to delete
	$contactId = $inData["contactId"];
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];

	// Establish connection to the database
	$conn = new mysqli("localhost", "User1", "COP4331", "Group26");
	if ($conn->connect_error)
	{
		returnWithError($conn->connect_error );
	}
	else
	{
		// Check if the user exist in the database
		$query = 'SELECT * FROM contacts WHERE contactID = ? AND firstName = ? AND lastName = ?';
		$stmt = $conn->prepare($query);
		$stmt->bind_param("iss", $contactId, $firstName, $lastName);
		$stmt->execute();
		$result = $stmt->get_result();
		
		// If the user exists, then it is ok to delete
		if (mysqli_num_rows($result) > 0)
		{
			// Create a delete query to delete a contact by looking for the contactID
			$deleteQuery = 'DELETE FROM contacts WHERE firstName = ? AND lastName = ? AND contactId = ?';
			// Delete the contact from the database
			$stmt = $conn->prepare($deleteQuery);
			$stmt->bind_param("ssi", $firstName, $lastName, $contactId);
			$stmt->execute();

			returnWithError("No error, Succesful");
		}
		else
		{
			returnWithError("User does not exist");
		}

		// Close the connection
		$stmt->close();
		$conn->close();
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
