<?php
// переменная переноса строки
$ENTER = "\n";
// параметры запроса
$arrContextOptions = array(
    "ssl" => array(
        "verify_peer"=>false,
        "verify_peer_name"=>false,
    ),
    'http' => array(
        'method'  => 'POST',
        'header'  => 'Content-type: application/x-www-form-urlencoded',
        'content' => http_build_query(
            array(
                'test'=>$_POST['test'],
                'q1'=>$_POST['quest'],
                $_POST['quest']=>1,
                'iter'=>5,
                'bil'=>199
            )
        )
    )
);  
// получение страницы ответа
$content = file_get_contents(
    'https://tests24.ru', 
    false, 
    stream_context_create($arrContextOptions)
);

for ($i = 3; $i < 6; $i++) { // проверяем цвет, начинающийся с 3, 4, 5

    // фрагмента кода для поиска в content
    $start = '<span class="f_sm" style="color:#'.$i;

    // определяем начало необходимого фрагмента кода, до которого мы удалим весь контент
    $pos = strpos($content, $start);

    if ($pos) { // если фрагмент найден, производим обработку
        // удаляем все до нужного фрагмента
        $content = substr($content, $pos + strlen($start) + 7);
        // находим конец необходимого фрагмента кода
        $pos = strpos($content, '</span>');
        // отрезаем нужное количество символов от конца фрагмента
        $content = substr($content, 0, $pos);        
        // заменяем переносы строки
        $content = str_replace(' <br />', $ENTER, $content); 
        // удаляем из текста теги
        $content = strip_tags($content);
        break; // если фрагмент найден, останавливаем перебор
    }
}

// выводим текст
echo($content)
?>