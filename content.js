import { compareSrtings, uniq } from "./utils/functions.js";
import { postData } from "./utils/post.js";
import { options } from "./options.js"
import { makeSelect } from "./utils/makeSelect.js";

//Отправка массива билетов в базу данных
const sendToSQL = async function (mass, gruppa) {
    mass.forEach(elem => {
        postData('./php/databaseconnect.php', {...elem, gruppa})
            .then(data => console.log(data));
    });
}

//Получение правильного ответа
const getCorrectAnswer = async function (elem, test, index) {
    const req = {
        test: test,
        quest: elem['question']
    };
    const data = await postData('./php/getCorrectAnswerRequest.php', req);

    for (let i = 1; i < 6; i++) {
        if (data === elem[`answer${i}`]) {
            elem['correctAnswer'] = i;
            break;
        }
    }

    if (elem['correctAnswer'] === 0) {
        console.log('data: ', data);
        for (let i = 1; i < 6; i++) {
            console.log(`answer${i}: `, elem[`answer${i}`]);
            if (compareSrtings(data, elem[`answer${i}`]) < 2) {
                elem['correctAnswer'] = i;
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
}

//Заполнение массива
const fillArray = function (content) {
    const mass = [];    //Массив билетов
    let shift = 0;      //Сдвиг. Увеличивается, если вопрос уже есть в массиве

    for (let i = 0; i < content.length; i++) {
        let question = content[i].getElementsByTagName('i')[0].innerText;
        let globalId = +content[i].querySelector("input[type=hidden]").value;

        //Обрезка номера вопроса
        let from = question.search(" ") + 1;
        question = question.substring(from);

        if (uniq(question, mass)) {
            let answers = content[i].getElementsByClassName('custom-control-label f_sm');
            const qNum = i - shift;             //Номер вопроса
            mass[qNum] = {
                id: qNum + 1,                   //Идентификатор
                globalId: globalId,             //Глобальный идентификатор
                question: question,             //Вопрос
                correctAnswer: 0,               //Правильный ответ
                glava: '',                      //Правила
            }

            //Ответы
            for (let k = 0; k < 5; k++) {
                mass[qNum][`answer${k + 1}`] = answers[k] ? answers[k].innerText : ''
            }
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
    await addCorrectAnswer(mass, dataSet['test']);
    sendToSQL(mass, dataSet['gruppa']);
}

document.getElementById('inputs').append(makeSelect());
document.getElementById('btn').onclick = start;