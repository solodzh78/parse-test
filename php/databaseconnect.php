<?php
// Параметры подключения к базе данных SQL
require 'db.php';

// Создаем соединение
$conn = mysqli_connect($servername, $username, $password, $database);

// Проверяем соединение
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

// echo ("Connected successfully\n");

// $input = json_decode(file_get_contents("php://input"), true);
// print_r($input);

$id=$_POST['id'];
$globalId=$_POST['globalId'];
$question=$_POST['question'];
$answers=$_POST['answers'];
$correctAnswer=$_POST['correctAnswer'];
$glava=$_POST['glava'];

$gruppa=$_POST['gruppa'];

// выполняем операции с базой данных
$query = "INSERT INTO ".$gruppa."(
        id, 
        globalId, 
        question, 
        answers,
        pravila, 
        correctAnswer, 
        glava
    ) 
    VALUES(
        '$id', 
        '$globalId', 
        '$question', 
        '$answers',
        '$pravila', 
        '$correctAnswer', 
        '$glava'
    )";

$result = mysqli_query($conn, $query) or die("Ошибка " . mysqli_error($conn)); 
if($result)
{
    echo "Выполнение запроса прошло успешно\n";
}
mysqli_close($conn);
?>