import { compareSrtings } from "./utils/functions";
import { postData } from "./utils/post";

const test = 743;
const gruppa = '5h';

let mass = [];
let content = document.getElementsByClassName('col-sm-12 col-md-12 col-lg-12');
let shift = 0;

//Проверка на уникальность
function uniq(question) {
    for (let k = 0; k < mass.length; k++) {
        if (mass[k].question === question) {
            console.log("повторяющийся вопрос: " + question);
            shift++;
            return false;
        }
    }
    return true;
}

//Отправка в базу данных
function sendToSQL(index) {
    postData('./php/databaseconnect.php', mass[index])
        .then(data => console.log(data));
}

//Получение правильного ответа
function getCorrectAnswer(index) {
    const req = {
        test: test,
        quest: mass[index]['question']
    };
    postData('./php/getCorrectAnswerRequest.php', req)
        .then(data => {
            const card = mass[index];
            for (let i = 1; i < 6; i++) {
                if (data === card[`answer${i}`]) {
                    card['correctAnswer'] = i;
                    break;
                }
            }

            if (card['correctAnswer'] === 0) {
                console.log('data: ', data);
                for (let i = 1; i < 6; i++) {
                    console.log(`answer${i}: `, card[`answer${i}`]);
                    if (compareSrtings(data, card[`answer${i}`]) < 2) {
                        card['correctAnswer'] = i;
                        break;
                    }
                }
            }

            if (card['correctAnswer'] === 0) console.warn(`В вопросе №${index + 1} не найден правильный ответ`);
            sendToSQL(index);
        });
}

//Заполнение массива
for(let i=0; i<content.length; i++) {
    let question = content[i].getElementsByTagName('i')[0].innerText;
    let globalId = +content[i].querySelector("input[type=hidden]").value;

    //Обрезка номера вопроса
    let from = question.search(" ") + 1;
    question = question.substring(from);

    if(uniq(question)){
        let answers = content[i].getElementsByClassName('custom-control-label f_sm');
        const qNum = i - shift;             //Номер вопроса
        mass[qNum] = {
            gruppa: gruppa,                 //Группа по электробезопасности
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
        getCorrectAnswer(qNum);
    }
}
console.log(mass);
