import { compareSrtings, uniq } from "./utils/functions.js";
import { postData } from "./utils/post.js";
import { options } from "./options.js"
import { makeSelect } from "./utils/makeSelect.js";

async function sendToSQL(mass, gruppa) {
    mass.forEach(elem => {
        postData('./php/databaseconnect.php', {...elem, gruppa})
            .then(data => console.log(data));
    });
}

//Получение правильного ответа
async function getCorrectAnswer(mass, test) {
    mass.forEach((elem, index) => {
        const req = {
            test: test,
            quest: elem['question']
        };
        postData('./php/getCorrectAnswerRequest.php', req)
            .then(data => {
                // const card = mass[index];
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
            });
    })
}

//Заполнение массива
async function fillArray(content) {
    const mass = [];
    let shift = 0;

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
async function getContent(data) {
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
async function start() {
    const select = document.getElementById('select').value;
    const dataSet = options[select].param;
    const content = await getContent(dataSet);
    const mass = await fillArray(content);
    console.log('mass: ', mass);
    await getCorrectAnswer(mass, dataSet['test']);
    await sendToSQL(mass, dataSet['gruppa']);
}

document.getElementById('inputs').append(makeSelect());
document.getElementById('btn').onclick = start;