<?php
	$inData = getRequestInfo();

    // Get the inputs from the input field
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$login = $inData["login"];
	$password = $inData["password"];

    // Establish a connection from the database
	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

    // Check for errors, if there are error, alert the user 
	if ($conn->connect_error)
	{
		returnWithError($conn->connect_error );
	}
	else
	{
		// Will run a query finding all the matching users
        $sqlQuery = "SELECT Login FROM Users WHERE Login=?";
		$stmt = $conn->prepare($sqlQuery);
		$stmt->bind_param("s", $login);
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
            $sqlInsert = "INSERT into Users (FirstName,LastName,Login,Password) VALUES (?,?,?,?)";
			$stmt = $conn->prepare($sqlInsert);
			$stmt->bind_param("ssss", $firstName, $lastName, $login, $password);
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