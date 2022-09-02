<?php
	$inData = getRequestInfo();

	$ID = 0;
	$firstName = "";
	$lastName = "";

	$conn = new mysqli("localhost", "User1", "COP4331", "Group26");
    
    // Will show an error if unable to connect to the database
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
        // Get the user inputs from the input field
		$stmt = $conn->prepare("SELECT ID, firstName, lastName FROM users WHERE userName = ? AND password = ?");
		$stmt->bind_param("ss", $inData["userName"], $inData["password"]);
		$stmt->execute();
		$result = $stmt->get_result();

        // Check if the user already exist in the database
		if( $row = $result->fetch_assoc()  )
		{
			returnWithInfo( $row['firstName'], $row['lastName'], $row['ID'] );
		}
        // User not found
		else
		{
			returnWithError("No Records Found");
		}

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
		$retValue = '{"ID":0,"FirstName":"","LastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithInfo( $firstName, $lastName, $ID )
	{
		$retValue = '{"ID":' . $ID . ',"FirstName":"' . $firstName . '","LastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}

?>
