<?php
// переменная переноса строки
$ENTER = "\n";
// параметры запроса
$arrContextOptions=array(
    "ssl"=>array(
        "verify_peer"=>false,
        "verify_peer_name"=>false,
    ),
    'http' => array(
        'method'  => 'POST',
        'header'  => 'Content-type: application/x-www-form-urlencoded',
        'content' => http_build_query(
            array(
                'test'=>$_POST['test'],
                'quest'=>$_POST['quest']
            )
        )
    )
);  
// получение страницы ответа
$content = file_get_contents(
    'https://tests24.ru/search.php', 
    false, 
    stream_context_create($arrContextOptions)
);
// определяем начало необходимого фрагмента кода, до которого мы удалим весь контент
$pos = strpos($content, 'Ответ: </i><b>');
// удаляем все до нужного фрагмента
$content = substr($content, $pos + 19);
// находим конец необходимого фрагмента кода
$pos = strpos($content, '</b></p>');
// отрезаем нужное количество символов от конца фрагмента
$content = substr($content, 0, $pos);
//если в нужном контенте встречается не нужный кусок текста, то его вырезаем
$content = str_replace(' <br />', $ENTER, $content); 
// удаляем из текста теги
$content = strip_tags($content);
// выводим текст
echo ($content);
?>