
<?php
	
	
	
	$inData = getRequestInfo();
	
	$firstName = $inData["FirstName"];
	$lastName = $inData["LastName"];
	$phone = $inData["Phone"];
	$email = $inData["Email"];
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

if($firstName==""||$lastName==""||$email==""||$phone==""){

	$idCheck->close();
		returnWithError("Please fillout each field.");

}else if($validUser > 0)
	{
		$idCheck->close();

		$stmt = $conn->prepare("INSERT into Contacts (FirstName, LastName, Phone, Email, UserID) VALUES(?,?,?,?,?)");
		$stmt->bind_param("sssss", $firstName, $lastName, $phone, $email, $userId);
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