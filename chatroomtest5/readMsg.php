<?php
session_start();
include_once("./db.php");

$query = "select * from `message`";

if ($rq = mysqli_query($db, $query)) {
    if (mysqli_num_rows($rq) > 0) {
        while($data = mysqli_fetch_assoc($rq)) {
            if ($data['phone'] == $_SESSION['phone']) {
?>
                <p class="sender">
                    <span><?= $data['phone'] ?></span>
                    <?= $data['message'] ?>
                </p>
            <?php
            } else {
            ?>
                <p><span><?php $data['phone'] ?></span>
                    <?= $data['message'] ?>
                </p>
<?php
            }
        }
    } else {
        echo "<h3> Chat is empty at this moment!!</h3>";
    }
}
?>