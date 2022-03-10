<?php
$test = $_POST['test'];                         // номер теста
$ticketQuantity = $_POST['ticketQuantity'];     // количество билетов

for ($i = 1; $i < ($ticketQuantity + 1); $i++) 
{      	
    // сторонняя страница сайта, с которой будем брать контент. 
    $arrContextOptions=array(
        "ssl"=>array(
            "verify_peer"=>false,
            "verify_peer_name"=>false,
        ),
    );  

    $content = file_get_contents('https://tests24.ru/?iter=4&bil='.$i.'&test='.$test, false, stream_context_create($arrContextOptions));

    // определяем начало необходимого фрагмента кода, до которого мы удалим весь контент
    $pos = strpos($content, '<div class="col-sm-12 col-md-12 col-lg-12">');

    // удаляем все до нужного фрагмента
    $content = substr($content, $pos);

    // находим конец необходимого фрагмента кода
    $pos = strpos($content, '<div class="custom-control custom-checkbox"><input type="checkbox" value="1" id="checkbox" name="report" class="custom-control-input"><label class="custom-control-label" for="checkbox">Сформировать протокол</label></div>');

    // отрезаем нужное количество символов от конца фрагмента
    $content = substr($content, 0, $pos);

    //если в нужном контенте встречается не нужный кусок текста, то его вырезаем
    // $content = str_replace('','', $content);  

    // выводим необходимый контент
    echo $content;
};
?>