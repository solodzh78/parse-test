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
$answer1=$_POST['answer1'];
$answer2=$_POST['answer2'];
$answer3=$_POST['answer3'];
$answer4=$_POST['answer4'];
$answer5=$_POST['answer5'];
$pravila=$_POST['pravila'];
$correctAnswer=$_POST['correctAnswer'];
$glava=$_POST['glava'];

$gruppa=$_POST['gruppa'];

// выполняем операции с базой данных
$query = "INSERT INTO ".$gruppa."(
        id, 
        globalId, 
        question, 
        answer1, 
        answer2, 
        answer3, 
        answer4, 
        answer5,
        pravila, 
        correctAnswer, 
        glava
    ) 
    VALUES(
        '$id', 
        '$globalId', 
        '$question', 
        '$answer1', 
        '$answer2', 
        '$answer3', 
        '$answer4', 
        '$answer5',
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