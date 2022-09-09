<?php
	$inData = getRequestInfo();

	// Get the data from frontend and store the inputs here
	$search = trim($inData["search"]);

	// Keeps track of the resultArray index
	$searchCount = 0;
	$searchResults = "";

    // Connect to the database
	$conn = new mysqli("localhost", "User1", "COP4331", "Group26");
	if ($conn->connect_error)
	{
		returnWithError($conn->connect_error );
	}
	else
	{
		$search1 = "%" . $search . "%";
		// Split the string into two words
		$split = explode (' ', $search, 2);
		// Check if there are more than 1 word in the search bar
		if (sizeof($split) > 1) 
		{
			// If there are more than 1 word, split them into two words and put them into two separate strings
			$search2 = "%" . $split[0] . "%";
			$search3 = "%" . $split[1] . "%";

			// Find contact using their first name or last name (must match their contactId)
			$query = "SELECT firstName, lastName, email, phoneNumber, streetAddress, city, state, zip 
			FROM contacts WHERE (firstName LIKE ? OR firstName LIKE ? OR lastName LIKE ? OR lastName LIKE ?) AND contactId = ?";
			// Prepare the query
			$stmt = $conn->prepare($query);
			$stmt->bind_param("ssssi", $search1, $search2, $search1, $search3, $inData["contactId"]);
		}
		// Only one word was in the search bar
		else 
		{
			// Find contact using their first name or last name (must match their contactId)
			$query = "SELECT firstName, lastName, email, phoneNumber, streetAddress, city, state, zip 
			FROM contacts WHERE (firstName LIKE ? OR lastName LIKE ?) AND contactId = ?";
			// Prepare the query
			$stmt = $conn->prepare($query);
			$stmt->bind_param("ssi", $search1, $search1, $inData["contactId"]);
		}

		// Run the query
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

        // Close the database connection
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

	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
?>
