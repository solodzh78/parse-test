import { compareSrtings, uniq } from "./utils/functions.js";
import { postData } from "./utils/post.js";
import { options } from "./options.js"
import { makeSelect } from "./utils/makeSelect.js";

//Отправка массива билетов в базу данных
const sendToSQL = async function (mass, gruppa) {
    mass.forEach(elem => {
        // преобразуем массив ответов в строку
        elem.answers = JSON.stringify(elem.answers);
        postData('./php/databaseconnect.php', {...elem, gruppa})
            .then(data => console.log(data));
    });
}

//Получение правильного ответа
const getCorrectAnswer = async function (elem, test, index) {
    const req = {
        test: test,
        quest: elem['globalId']
    };
    const data = await postData('./php/getCorrectAnswerRequest1.php', req);

    for (let i = 0; i < elem['answers'].length; i++) {
        if (data === elem['answers'][i]) {
            elem['correctAnswer'] = i + 1;
            break;
        }
    }

    if (elem['correctAnswer'] === 0) {
        console.log('data: ', data);
        for (let i = 0; i < elem['answers'].length; i++) {
            console.log(`answer${i + 1}: `, elem['answers'][i]);
            if (compareSrtings(data, elem['answers'][i]) < 2) {
                elem['correctAnswer'] = i + 1;
                break;
            }
        }
    }

    if (elem['correctAnswer'] === 0) {
        console.warn(`В вопросе №${index + 1} не найден правильный ответ`)
    }
};

//Добавление правильного ответа
const addCorrectAnswer = async function (mass, test) {
    const promises = mass.map(async (elem, index) => getCorrectAnswer(elem, test, index));
    await Promise.all(promises);
    // const promises = getCorrectAnswer(mass[2], test, 1);
    // await promises;
}

//Заполнение массива
const fillArray = function (content) {
    const mass = [];    //Массив билетов
    let shift = 0;      //Сдвиг. Увеличивается, если вопрос уже есть в массиве

    for (let i = 0; i < content.length; i++) {
        //Выделение вопроса из content
        let question = content[i].getElementsByTagName('i')[0].innerText;
        //Обрезка номера вопроса
        const from = question.search(" ") + 1;
        question = question.substring(from);
        //Выделение глобального идентификатора из content
        const globalId = +content[i].querySelector("input[type=hidden]").value;

        if (uniq(question, mass)) { //Если такого вопроса нет массиве билетов

            //Выделение ответов из коллекции content[i]
            const answersCollection = content[i].getElementsByClassName('custom-control-label f_sm');
            const answers = [];
            for (let k = 0; k < answersCollection.length; k++) {
                answers[k] = answersCollection[k].innerText
            }

            const qNum = i - shift;             //Индекс вопроса
            
            //Запись билета в массив
            mass[qNum] = {
                id: qNum + 1,                   //Идентификатор
                globalId,                       //Глобальный идентификатор
                question,                       //Вопрос
                correctAnswer: 0,               //Правильный ответ
                glava: '',                      //Правила
                answers,                        //Массив ответов
            };

        } else shift++
    }
    return mass;
}

//Получение данных с сервера
const getContent = async function (data) {
    return postData('./php/getContent.php', data)
        .then(data => {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = data;
            document.getElementById('root').append(tempDiv);
            const content = tempDiv.getElementsByClassName('col-sm-12 col-md-12 col-lg-12');
            return content;
        });
}

//Запуск при нажатии на кнопку
const start = async function () {
    const select = document.getElementById('select').value;
    const dataSet = options[select].param;
    const content = await getContent(dataSet);
    const mass = fillArray(content);
    console.log('mass: ', mass);
    await addCorrectAnswer(mass, dataSet['test']);
    sendToSQL(mass, dataSet['gruppa']);
}

const check = function () {
    postData('./php/get_from_db_with_id.php', { id: '185193', gruppa: 'h5' })
        .then(data => data.json())
        .then(card = console.log(data));
};

document.getElementById('inputs').append(makeSelect());
document.getElementById('inputs').append(makeSelect());
document.getElementById('btn').onclick = start;
document.getElementById('btn-load').onclick = check;