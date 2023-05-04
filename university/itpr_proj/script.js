const welcomeWindow = document.querySelector('.welcome-window'),
      createWindow = document.querySelector('.create-window'),
      createPollBtn = document.querySelector('.create-poll'),
      succesWindow = document.querySelector('.succes-window'),
      welcomeFooter = document.querySelector('.footer-welcome'),
      resultWindow = document.querySelector('.result-window'),
      arrow = document.querySelector('.arrow');

createPollBtn.addEventListener('click', () => {
    welcomeWindow.classList.add('hide');
    welcomeFooter.classList.add('hide');
    createWindow.classList.remove('hide');
    arrow.classList.remove('hide');
});

arrow.addEventListener('click', () => {
    location.reload();
});

const postData = async (url, data) => {
    let res = await fetch(url, {
        method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });
    return await res.json(); 
};

//createPoll

const applyCreateBtn = document.querySelector('.apply-create');
let amountAltern = 0;
const createError = document.querySelector('.create-error');

applyCreateBtn.addEventListener('click', () => {
    amountAltern = +document.querySelector('#amount-altern').value;
    if (!amountAltern) {
        createError.textContent = 'Не введено кількість альтернатив!';
    } else if (amountAltern <= 0 || amountAltern > 100) {
        createError.textContent = 'Некоректна кількість (>100 або <0)!';
    } else {
        document.querySelector('.create-quest-altern').classList.add('hide');
        if (amountAltern == 0) return;
  
        setTimeout(()=> {
            const scaleType = document.querySelector('#scale-type');

            scaleType.addEventListener('change', (e) => {
                e.preventDefault();
                let type = scaleType.value;

                if (type == "image") {
                    scaleType.disabled = true;
                    let amountScale = 5;
                    for (let i = 1; i <= amountScale; i++) {

                        createForm.insertAdjacentHTML("beforeend", `
                            <div>
                                <input type="hidden" name="scale-type" value="image" />
                                <label for="scale-src-${i}">Для шкали оцінювання ${i}</label> 
                                <input id="scale-src-${i}" type="text" name="scale-src-${i}" placeholder="Уведіть посилання" required />
                            </div>
                        `);
                    }
                }   
            
            });

            const alternType = document.querySelector('#altern-type');
            alternType.addEventListener('change', (e )=> {
                e.preventDefault();
                let type = alternType.value;

                if (type == "video" || type == "image") {
                    alternType.disabled = true;
                    createForm.insertAdjacentHTML("beforeend", `<input type="hidden" name="altern-type" value=${type} />`);
                    for (let i = 1; i <= amountAltern; i++) {
                        createForm.insertAdjacentHTML("beforeend", `
                            <div>
                                <label for="altern-src-${i}">Ресурс для альтернативи ${i}</label> 
                                <input id="altern-src-${i}" type="text" name="altern-src-${i}" placeholder="Уведіть посилання" required />
                            </div>
                        `);
                    }
                } 
            });
        }, 1);

        const createForm = document.querySelector('.create-form');
        createForm.classList.remove('hide');
        
        for (let i = 1; i <= amountAltern; i++) {
            createForm.innerHTML += `
            <div>
                <label for="altern-name-${i}">Альтернатива ${i}</label> 
                <input id="altern-name-${i}" type="text" name="altern-name-${i}" placeholder="Уведіть назву" required />
            </div>
            `
        }
        createForm.innerHTML += `
        <div style="text-align: center;">
            <p class="form-error error"></p>
            <button class="btn create-btn">Створити</button>
        </div>
        `;

        createForm.addEventListener('submit', (event) => {
            event.preventDefault(); 

            let formData = new FormData(createForm);
            let json = JSON.stringify(Object.fromEntries(formData.entries()));
            const formError = document.querySelector('.form-error');

            if (!JSON.parse(json)['scale-type']) {
                formError.textContent = 'Не обрано тип шкали!';
            } else if (!JSON.parse(json)['altern-type']) {
                formError.textContent = 'Не обрано тип альтернатив!';
            } else {
                postData('https://itpr-231e2-default-rtdb.europe-west1.firebasedatabase.app/createdforms.json', json)
                    .then(data => {
                        let id = data.name;
                        succesWindow.innerHTML = `
                            <div class="header-succes"><h3>Вітаємо, ваше опитування успішно створено!</h3></div>
                            <div>Щоб інші користувачі змогли приєднатись - надайте їм ID: <p id="text-to-copy"><strong>${id}</strong></p></div>
                            <p class="success"></p>
                            <button class='btn copy-id'>Скопіювати ID</button>
                            <button class='btn go-head'>Перейти до опитування</button>
                            <button class='btn go-welcome'>Повернутись на головну</button>
                        `;
                        document.querySelector('.create-quest-altern').classList.remove('hide');
                        
                        function copyText() {
                            const textToCopy = document.getElementById("text-to-copy");
                            const tempTextArea = document.createElement("textarea");
                            tempTextArea.value = textToCopy.innerText;
                            document.body.appendChild(tempTextArea);
                            tempTextArea.select();
                            document.execCommand("copy");
                            document.body.removeChild(tempTextArea);
                            document.querySelector('.success').textContent = "ID успішно скопійовано!";
                        }

                        let copyIdBtn = document.querySelector('.copy-id');
                        copyIdBtn.addEventListener('click', () => copyText());
                        document.querySelector('.go-head').addEventListener('click', () => {
                            succesWindow.classList.add('hide');
                            headWindow.classList.remove('hide');
                            showHeadWindow(id);
                        });
                        document.querySelector('.go-welcome').addEventListener('click', () => {
                            location.reload();
                        });
                    })
                    .catch(error => console.error(error));
                createWindow.classList.add('hide');
                succesWindow.classList.remove('hide');
            }
        });
    }
});

//Join window 

const joinBtn = document.querySelector('.join-poll'),
      joinWindow = document.querySelector('.join-window'),
      joinError = document.querySelector('.join-error');

function joinWindowFunc(btnClass) {
    const btn = document.querySelector(btnClass);
    btn.addEventListener('click', (event) => {
        let pollId = document.querySelector('#poll-id').value;
        if (!pollId.trim()) {
            console.log('er');
            joinError.textContent = 'Не уведено ID опитування!';
        } else {
            getResource('https://itpr-231e2-default-rtdb.europe-west1.firebasedatabase.app/createdforms.json')
                .then(data => {
                    let currentPoll = data[pollId];
                    if(!currentPoll) {
                        console.log('err');
                        joinError.textContent = 'Такого ID не існує!'
                    } else {
                        if (event.target.classList.value == 'btn choose-id-btn') {
                            joinWindow.classList.add('hide');
                            headWindow.classList.remove('hide');
                            showHeadWindow(pollId);
                        } else if (event.target.classList.value == 'btn check-id-btn') {
                            showResults(pollId, currentPoll);
                            joinWindow.classList.add('hide');
                            resultWindow.classList.remove('hide');
                        }   
                    }
                });
            }
    });
}
joinBtn.addEventListener('click', () => {
    welcomeWindow.classList.add('hide');
    welcomeFooter.classList.add('hide');
    joinWindow.classList.remove('hide');
    arrow.classList.remove('hide');
    joinWindowFunc('.check-id-btn');
    joinWindowFunc('.choose-id-btn');

});

//Head window
const headWindow = document.querySelector('.head-window');
let temp = 1;

const getResource = async (url) => {
    let res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Could not fetch ${url}, status: ${res.status}`);
    }
    return await res.json(); 
};

function showHeadWindow(id) {

    getResource('https://itpr-231e2-default-rtdb.europe-west1.firebasedatabase.app/createdforms.json')
        .then(data => {

            let currentPoll = data[id];

            headWindow.innerHTML += `
                <h2>${currentPoll['name-poll']}</h2>
                <form class="answer-form">
                    <input type="hidden" name="pollId" value="${id}" />
                </form>
            `;

            let answerForm = document.querySelector('.answer-form');
            let numOfScale = 0,
                numOfAltern = 0;

            for (key in currentPoll) {
                if (key.includes('scale-src')) {
                    numOfScale++;
                }
                if (key.includes('altern-name')) {
                    numOfAltern++;
                }
            }

            if (currentPoll['altern-type'] == 'image') {
                for (let i = 1; i <= numOfAltern; i++) {
                    let currentAltern = currentPoll[`${'altern-name-'+ i}`];
                    let currentAlternImg = currentPoll[`${'altern-src-'+ i}`];
                    answerForm.innerHTML += `
                        <div>
                            <h5>${currentAltern}</h5>
                            <div>
                                <img class="altern-img" src="${currentAlternImg}">
                            </div>
                            <div>
                                ${addScale(numOfAltern)}
                            </div>
                        </div>
                    `;
                }
            }
            else if (currentPoll['altern-type'] == 'text') {

                for (let i = 1; i <= numOfAltern; i++) {
                    let currentAltern = currentPoll[`${'altern-name-'+ i}`];
                    answerForm.innerHTML += `
                        <div>
                            <h5>${currentAltern}</h5>
                            <div>
                                ${addScale(numOfAltern)}
                            </div>
                        </div>
                    `;
                }
            }
            else if (currentPoll['altern-type'] == 'video') {
                for (let i = 1; i <= numOfAltern; i++) {
                    let currentAltern = currentPoll[`${'altern-name-'+ i}`];
                    let currentAlternVideo = currentPoll[`${'altern-src-'+ i}`];
                    answerForm.innerHTML += `
                        <div>
                            <h5>${currentAltern}</h5>
                            <div>
                                ${currentAlternVideo}
                            </div>
                            <div>
                                ${addScale(numOfScale)}
                            </div>
                        </div>
                    `;
                }
            }

            answerForm.innerHTML += `
                <button class="btn send-answer">Надіслати</button>
            `;

            answerForm.addEventListener('submit', (event) => {
                event.preventDefault(); 
                let formData = new FormData(answerForm);
        
                let json = JSON.stringify(Object.fromEntries(formData.entries()));
                
                postData('https://itpr-231e2-default-rtdb.europe-west1.firebasedatabase.app/answers.json', json)
                .then(data => {
                    headWindow.classList.add('hide');
                    resultWindow.classList.remove('hide');
                    showResults(id, currentPoll);
                })
                .catch(error => console.error(error));
        
            });

            function addScale(i) {
                if (currentPoll['scale-type'] == 'numeric') {
                    let str = `<input type="number" min="1" max="5" name="answer-to-${temp}" required>`;
                    temp += 1;
                    return str;
                }
                else if (currentPoll['scale-type'] == 'color') {
                    let str = `<input type="range" class="color-range" step="1" min="1" max="5" name="${'answer-to-'+temp}">`;
                    temp += 1;
                    return str;
                }
                else if (currentPoll['scale-type'] == 'slider') {
                    let str = `<input type="range" min="1" max="5" step="1" name="${'answer-to-'+temp}"\>`;
                    temp += 1;
                    return str;
                }
                else if (currentPoll['scale-type'] == 'image') {
                    let str = '<div style = "display: flex; flex-wrap: wrap; justify-content: center;">';
                    for (let j = 1; j <= 5; j++) { //5 == i
                        str += `
                            <div class="radio-tile-group">
                                <div class="input-container">
                                    <input class="radio-button" name="answer-to-${temp}" value="${j}" type="radio" required>
                                    <div class="radio-tile">
                                        <div>
                                            <img src="${currentPoll['scale-src-'+j]}" alt="img">
                                        </div>
                                    </div>
                                </div>
                            </div>`
                    }
                    str += '</div>'
                    temp+=1;
                    return str;
                }
            }
            
        });
}

//Result window


function showResults(id, currentPoll) {
    getResource('https://itpr-231e2-default-rtdb.europe-west1.firebasedatabase.app/answers.json')
    .then(data => {
        const answers = data;
        let answersToThisPoll = [];
        for (let key in answers) {
            if (answers[key].pollId == id) {
                answersToThisPoll.push(answers[key]);
            }
        }

        let countOfAnswers = answersToThisPoll.length;
        let numOfAltern = 0;
        let answersAverage = {};
        let sum = 0;
        let answersDom = {};

        for (key in currentPoll) {
            if (key.includes('altern-name')) {
                numOfAltern++;
            }
        }

        for (let j = 1; j <= numOfAltern; j++) {
            answersDom[j] = {'1':0,'2':0,'3':0,'4':0,'5':0};
        }
 
        for (let k = 1; k <= numOfAltern; k++) {
            for (let i = 0; i < countOfAnswers; i++) {
                let answer = answersToThisPoll[i];
                sum += +answer[`answer-to-${k}`];
                answersDom[k][answer[`answer-to-${k}`]]++; 
            }
            answersAverage[`answer-average-${k}`] = (sum / countOfAnswers).toFixed(2);
            sum = 0;
        }

        resultWindow.innerHTML += `
            <div><h3>${currentPoll['name-poll']}</h3></div>
            <div><h5>ID опитування: ${id}</h5></div>
            <div class = "example">
                <div class = "r1">1</div>
                <div class = "r2">2</div>
                <div class = "r3">3</div>
                <div class = "r4">4</div>
                <div class = "r5">5</div>
            </div>
        `;

        for (let i = 1; i <= numOfAltern; i++) {
            resultWindow.innerHTML += `
                <div><h4>Для альтернативи ${i}: ${currentPoll[`altern-name-${i}`]}</h4></div>
                <div style="color: black"><h6>Середнє значення: ${answersAverage[`answer-average-${i}`]}</h6></div>
                <div class = "results">
                    ${calcDom(i)}
                </div>`;
        }


        let kievDate = new Date().toLocaleString('en-US', { timeZone: 'Europe/Kiev' });
        let date = new Date(kievDate);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        const formattedDate = `${day}.${month}.${year} ${hours}:${minutes}`;


        resultWindow.innerHTML += `
            <div class="poll-stat"><h4>Статистика опитування</h4>
            <h5>Дата проходження: ${formattedDate}</h5>
            <h5>Кількість відповідей: ${countOfAnswers}</h5></div>
        `;

        function calcDom(numAlt) {
            let sumOfAnsw = 0;
            let res = '';

            for (let i = 1; i <= 5; i++) {
                sumOfAnsw += answersDom[numAlt][i];
            }
            for (let j = 1; j <= 5; j++) {
                answersDom[numAlt][j] = ((answersDom[numAlt][j]/sumOfAnsw) * 100).toFixed(2);
                const screenWidth = window.screen.width;
                if (screenWidth > 720) {
                    if (answersDom[numAlt][j] >= 6.00) {
                        res += `<div class = "r${j}" style="width:${answersDom[numAlt][j]}%;">${answersDom[numAlt][j]}</div>`;
                    } else if (answersDom[numAlt][j] <= 6.00 && answersDom[numAlt][j] > 0.00) {
                        res += `<div class = "r${j}" style="width:${answersDom[numAlt][j]}%;">${Math.round(answersDom[numAlt][j])}</div>`;
                    }
                } else {
                    if (answersDom[numAlt][j] >= 20.00) {
                        res += `<div class = "r${j}" style="width:${answersDom[numAlt][j]}%;">${answersDom[numAlt][j]}</div>`;
                    } else if (answersDom[numAlt][j] <= 20.00 && answersDom[numAlt][j] >= 4.00) {
                        res += `<div class = "r${j}" style="width:${answersDom[numAlt][j]}%;">${Math.round(answersDom[numAlt][j])}</div>`;
                    } else if (answersDom[numAlt][j] < 4.00 && answersDom[numAlt][j] > 0.00) {
                        res += `<div class = "r${j}" style="width:${answersDom[numAlt][j]}%;">&nbsp</div>`;
                    }
                }
            }
            
            return res;
        }
    });
}