<?php
//db.inc.php
$db_host = "localhost";
$db_user = "root";
$db_password = "root";
$db_name = "finalApp";

try{
    $pdo = new PDO('mysql:host='.$db_host.';dbname='.$db_name, $db_user, $db_password);}
catch(PDOException  $err ){
    echo "Database connection problem: " . $err->getMessage();
    exit();		//page should stop running if you fail to connect to the database
}
?>