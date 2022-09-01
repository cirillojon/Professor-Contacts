<?php
	$inData = getRequestInfo();
    
    // Establish a database connection
    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "Group26"); 
	if ($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}
	else
	{
        // Get the data from frontend and store the inputs here
		$firstName = $inData["firstName"];
		$lastName = $inData["lastName"];
		$phoneNumber = $inData["phoneNumber"];
		$emailAddress = $inData["emailAddress"];
		$streetAddress = $inData["streetAddress"];
		$city = $inData["city"];
		$state = $inData["state"];
		$zip = $inData["zip"];
		$contactId = $inData["contactId"];

		// Create an insert query that includes the input from the user
		$sqlInsert = "INSERT INTO contacts (firstName, lastName, email, phoneNumber, streetAddress, city, state, zip) VALUES (?,?,?,?,?,?,?,?,?)";

        // Insert a new contact to the database
		$stmt = $conn->prepare($sqlInsert);
		$stmt->bind_param("ssssssss", $firstName, $lastName, $emailAddress, $phoneNumber, $streetAddress, $city, $state, $zip);
		$stmt->execute();

        // Close the database
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
