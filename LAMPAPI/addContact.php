<?php
	$inData = getRequestInfo();

	// Get the data from frontend and store the inputs here
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$phoneNumber = $inData["phoneNumber"];
	$emailAddress = $inData["email"];
	$streetAddress = $inData["streetAddress"];
	$city = $inData["city"];
	$state = $inData["state"];
	$zip = $inData["zip"];
	$userId = $inData["userId"];
    
    // Establish a database connection
	$conn = new mysqli("localhost", "User1", "COP4331", "Group26");
	if ($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}
	else
	{
		// Create an insert query that includes the input from the user
		$sqlInsert = "INSERT INTO contacts (userId, firstName, lastName, email, phoneNumber, streetAddress, city, state, zip) VALUES (?, ?,?,?,?,?,?,?,?)";

        // Insert a new contact to the database
		$stmt = $conn->prepare($sqlInsert);
		$stmt->bind_param("issssssss", $userId, $firstName, $lastName, $emailAddress, $phoneNumber, $streetAddress, $city, $state, $zip);
		$stmt->execute();

		returnWithError("No error, successful");

        // Close the database
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

    function returnWithError( $err )
    {
      $retValue = '{"error":"' . $err . '"}';
      sendResultInfoAsJson( $retValue );
    }
?>
