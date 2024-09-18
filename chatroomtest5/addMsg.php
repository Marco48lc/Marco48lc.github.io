<?php
session_start();
include_once("./db.php");
$message = $_GET['message'];
$phone = $_SESSION['phone'];


$query = "select * from `users` where phone = '$phone'";
  if ($rq = mysqli_query($db, $query)) {
    if(mysqli_num_rows($rq) == 1) {
        $query = "INSERT INTO `message`(`phone`, `message`) VALUES ('$phone','$message')";
        $rq = mysqli_query($db, $query);
    }};
?>