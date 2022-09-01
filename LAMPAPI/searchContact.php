<?php
	$inData = getRequestInfo();
	
    // Connect to the database
	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "Group26");
	if ($conn->connect_error)
	{
		returnWithError($conn->connect_error );
	}
	else
	{
		// Get the data from frontend and store the inputs here
		$firstName = "%" . $inData["search"] . "%";
		$lastName = "%" . $inData["search"] . "%";
		// Keeps track of the resultArray index
		$searchCount = 0;

		// Find contact using their first name or last name (must match their contactId)
		$query = "SELECT firstName, lastName, email, phoneNumber, streetAddress, city, state, zip 
				FROM contacts WHERE (firstName LIKE ? OR lastName LIKE ?) AND contactId = ?";
		// Prepare the query
		$stmt = $conn->prepare($query);
		$stmt->bind_param("ssi", $firstName, $lastName, $inData["userId"]);
		// Run the query
        $stmt->execute();

        // Gets the result form the query
		$result = $stmt->get_result();
		$resultArray = array();

		while($row = $result->fetch_assoc())
		{
			// Add each query into a 2d array to be shown to the user
			$resultArray[$searchCount] = array(
				"firstName" => $row["firstName"],
				"lastName" => $row["lastName"],
				"email" => $row["email"],
				"phoneNumber" => $row["phoneNumber"],
				"streetAddress" => $row["streetAddress"],
				"city" => $row["city"],
				"state" => $row["state"],
				"zip" => $row["zip"],
				"contactId" => $row["contactId"],
			);

			$searchCount++;
		}
        
        // No records found
		if( $searchCount == 0 )
		{
			returnWithError("No Records Found" );
		}
        // Show the results
		else
		{
			returnWithArray($resultArray);
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

	function returnWithArray( $resultArray )
	{
		$json = json_encode($resultArray, JSON_PRETTY_PRINT);
		$retValue = '{"results":' . $json . ',"id":-1,"error":""}';
		//echo ;
		sendResultInfoAsJson( $retValue );
	}
?>
