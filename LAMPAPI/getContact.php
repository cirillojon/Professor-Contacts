<?php
	$inData = getRequestInfo();

	// Get the contact ID of the person the user wants to delete
	$userId = $inData["userId"];
	$ID = $inData["ID"];

	// Establish connection to the database
	$conn = new mysqli("localhost", "User1", "COP4331", "Group26");
	if ($conn->connect_error)
	{
		returnWithError($conn->connect_error );
	}
	else
	{
		// Check if the user exist in the database
		$query = 'SELECT * FROM contacts WHERE ID = ? AND userId = ?';
		$stmt = $conn->prepare($query);
		$stmt->bind_param("ii", $ID, $userId);
		$stmt->execute();
		// Gets the result form the query
		$result = $stmt->get_result();
		while($row = $result->fetch_assoc())
		{
			if ($searchCount > 0) 
			{
				$searchResults .= ",";
			}
			// Increment search count
			$searchCount++;
			// Add each query into a 2d array to be shown to the user
			//$searchResults .= '"' . $row["firstName"] . ' '. $row["lastName"] . ', '.'PhoneNumber: '. $row["phoneNumber"] .', '. 'Email: '. $row["email"]. '"';
			$searchResults .= json_encode($row);
		}
        
        // No records found
		if( $searchCount == 0 )
		{
			returnWithError("No Records Found" );
		}
        // Show the results
		else
		{
			returnWithInfo($searchResults);
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

	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
?>
