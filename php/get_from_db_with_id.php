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
$gruppa=$_POST['gruppa'];

// выполняем операции с базой данных
$query = "SELECT * FROM $gruppa WHERE globalId IN ($id)";
// $query = "INSERT INTO ".$gruppa."(
//         id, 
//         globalId, 
//         question, 
//         answers,
//         pravila, 
//         correctAnswer, 
//         glava
//     ) 
//     VALUES(
//         '$id', 
//         '$globalId', 
//         '$question', 
//         '$answers',
//         '$pravila', 
//         '$correctAnswer', 
//         '$glava'
//     )";

$result = mysqli_query($conn, $query) or die("Ошибка " . mysqli_error($conn)); 
$card = mysqli_fetch_assoc($result);
$answers = $card['answers'];
// echo $answers;
echo json_encode($card);
// if($result)
// {
//     while ($row = $result->fetch_assoc()){
//         // $row['answers'] = json_decode($row['answers']);
//         // $row['id'] = (int)$row['id'];
//         // $row['globalId'] = (int)$row['globalId'];
//         // $row['correctAnswer'] = (int)$row['correctAnswer'];
//         $user_arr[] = $row;
//     };
//     echo ($user_arr);
// }
mysqli_close($conn);

// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Headers: X-Requested-With, Content-Type, Origin, Cache-Control, Pragma, Authorization, Accept, Accept-Encoding");

// require_once './functions/functions.php';	
// $gruppa = $_POST['gruppa'];
// $id=$_POST['id'];
// // Получение массива всех id таблицы
// // $all_id = getQueryId (stripcslashes("SELECT id FROM $gruppa"));
// // Получение массива из 10 уникальных id, выбранных случайным образом
// // $questions_id = getQuestions($all_id, 10);
// // Преобразование массива в строку, состоящую из элементов массива, разделенных запятой 
// // $questions_id_to_string = implode(',',$questions_id);
// // Формирование строки запроса
//     $query = "SELECT * FROM $gruppa WHERE id IN ($id)";
// // Выполнение запроса для получения билета
//     $card = getQuery ($query);
// // Отправка билета в формате JSON
// // echo json_encode($card);

//     // echo $card['answers'];

// // $answers = json_decode($card);
// // print_r($card['answers']);
// // print_r($answers);
// // $card['answers'] = json_decode($card['answers']);
// // echo(var_dump($all_id[0]));
// // echo var_dump($questions_to_string);
// // echo var_dump($query);
// echo 'connect';
// exit; // - обязательно	
// // "SELECT * FROM h5 WHERE id IN (66,164,62,211,33,172,254,374,95,207)"
?>