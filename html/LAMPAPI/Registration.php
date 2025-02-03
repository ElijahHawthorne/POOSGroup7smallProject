<?php
    $inData = getRequestInfo();
    
    $firstName = $inData["FirstName"];
    $lastName = $inData["LastName"];
    $login = $inData["Login"];
    $password = $inData["Password"];

    //Connect to database
    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    if ($conn->connect_error) 
    {
        returnWithError($conn->connect_error);
    } 
    else
    {
        //Check if the username already exists
        $stmt = $conn->prepare("SELECT ID FROM Users WHERE Login = ?");
        $stmt->bind_param("s", $login);
        $stmt->execute();
        $stmt->store_result();
        
        if ($stmt->num_rows > 0) 
        {
            //Username taken
            $stmt->close();
            $conn->close();
            returnWithError("Username already exists.");
        } 
        else 
        {
            $stmt->close();
            $stmt = $conn->prepare("INSERT into Users (FirstName, LastName, Login, Password) VALUES(?,?,?,?)");
            $stmt->bind_param("ssss", $firstName, $lastName, $login, $password);
            $stmt->execute();
            $stmt->close();
            $conn->close();
            returnWithError(""); //No error
        }
    }

    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson($obj)
    {
        header('Content-type: application/json');
        echo $obj;
    }

    function returnWithError($err)
    {
        $retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }
?>

