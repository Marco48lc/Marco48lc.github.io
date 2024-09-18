<?php
session_start();
if(isset($_SESSION['userName']) && isset($_SESSION['phone'])){
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chatroom</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <h1>Chatroom</h1>
    <div class="chat">
        <h2> Welcome to <span><?= $_SESSION['userName']?></span></h2>
        <div class="msg">
        </div>
        <div class="input_msg" method="get">
            <input type="text" name="input" placeholder="Type your message" id="input_msg">
            <button type="submit" onclick="update()">Send</button>
        </div>
    </div>
    <script src="js/script.js"></script>
</body>
</html>
<?php 
}else{
    header("location:login.php");
}
?>