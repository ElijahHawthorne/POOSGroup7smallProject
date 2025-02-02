<?php
	$inData = getRequestInfo();

   $contactID = $inData["contactID"];
	$inFirstName = $inData["inFirstName"];
	$inLastName = $inData["inLastName"];
	$inPhone = $inData["inPhone"];
	$inEmail = $inData["inEmail"];
	$userId = $inData["UserID"];
	

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 

	$idCheck = $conn->prepare("SELECT COUNT(*) FROM Users WHERE ID = ?");
	$idCheck->bind_param("s", $userId);
	$idCheck->execute();
	$idCheck->bind_result($validUser); 
	$idCheck->fetch();  

	if($validUser > 0)
	{
		$idCheck->close();

		$stmt = $conn->prepare("UPDATE Contacts SET FirstName = ?, LastName = ?, Phone = ?, Email = ? WHERE ID = ?");
		$stmt->bind_param("sssss", $inFirstName, $inLastName, $inPhone, $inEmail, $contactID);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		
		returnWithError("");
	} else {
		$idCheck->close();
		returnWithError("invalid UserID");
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