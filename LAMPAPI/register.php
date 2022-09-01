<?php
	$inData = getRequestInfo();

    // Establish a connection from the database
	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

    // Check for errors, if there are error, alert the user 
	if ($conn->connect_error)
	{
		returnWithError($conn->connect_error );
	}
	else
	{
		// Get the inputs from the input field
		$firstName = $inData["firstName"];
		$lastName = $inData["lastName"];
		$userName = $inData["userName"];
		$password = $inData["password"];


		// Will run a query finding all the matching usernames
        $sqlQuery = "SELECT userName FROM users WHERE userName = ?";
		$stmt = $conn->prepare($sqlQuery);
		$stmt->bind_param("s", $userName);
		$stmt->execute();
		$result = $stmt->get_result();

		// Check if the username already exist then alert the user
		if (mysqli_num_rows($result) > 0)
		{
			returnWithError("Username Already Exists!");
		}
		else
		{
			// If the previous statement passed, then add the user to the database
            $sqlInsert = "INSERT into users (firstName, lastName, userName, password) VALUES (?,?,?,?)";
			$stmt = $conn->prepare($sqlInsert);
			$stmt->bind_param("ssss", $firstName, $lastName, $userName, $password);
			$stmt->execute();

			returnWithError("");
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
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}