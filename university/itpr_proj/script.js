const welcomeWindow = document.querySelector('.welcome-window'),
      createWindow = document.querySelector('.create-window'),
      createPollBtn = document.querySelector('.create-poll'),
      succesWindow = document.querySelector('.succes-window');

createPollBtn.addEventListener('click', () => {
    welcomeWindow.classList.add('hide');
    createWindow.classList.remove('hide');
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

applyCreateBtn.addEventListener('click', () => {
    amountAltern = +document.querySelector('#amount-altern').value;
    document.querySelector('.create-quest-altern').classList.add('hide');
    if (amountAltern == 0) return;

    setTimeout(()=> {
        const scaleType = document.querySelector('#scale-type');

        scaleType.addEventListener('change', (e) => {
            e.preventDefault();
            // scaleType.disabled = true;
            let type = scaleType.value;

            if (type == "video" || type == "image") {
                let amountScale = +prompt('Скільки буде зображень/відео для шкали оцінювання?');
                for (let i = 1; i <= amountScale; i++) {
                    createForm.insertAdjacentHTML("beforeend", `
                        <div>
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
            // alternType.disabled = true;
            let type = alternType.value;

            if (type == "video" || type == "image") {
                for (let i = 1; i <= amountAltern; i++) {
                    createForm.insertAdjacentHTML("beforeend", `
                        <div>
                            <label for="altern-src-${i}">Для альтернативи ${i}</label> 
                            <input id="altern-src-${i}" type="text" name="altern-src-${i}" placeholder="Уведіть посилання" required />
                        </div>
                    `);
                }
            } 
        });
    },1);

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
        <button class="btn create-btn">Створити</button>
    </div>
    `;

    createForm.addEventListener('submit', (event) => {
        event.preventDefault(); 

        let formData = new FormData(createForm);
        let json = JSON.stringify(Object.fromEntries(formData.entries()));

        postData('http://localhost:3000/createdforms', json)
            .then(data => {
                console.log(data);
                let id = data.id;
                succesWindow.innerHTML = `
                    <div><h3>Вітаємо, ваше опитування успішно створено!</h3></div>
                    <div>Щоб інші користувачі змогли приєднатись - надайте їм ID ${id}</div>
                    <button class='btn go-head'>Перейти до опитування</button>
                    <button class='btn go-welcome'>Повернутись на головну</button>
                `;
                document.querySelector('.create-quest-altern').classList.remove('hide');

                document.querySelector('.go-head').addEventListener('click', () => {
                    succesWindow.classList.add('hide');
                    headWindow.classList.remove('hide');
                    showHeadWindow(id);
                });
                document.querySelector('.go-welcome').addEventListener('click', () => {
                    succesWindow.classList.add('hide');
                    welcomeWindow.classList.remove('hide');
                    createForm.reset();
                });
            })
            .catch(error => console.error(error));
        createWindow.classList.add('hide');
        succesWindow.classList.remove('hide');
    });
});

//Join window 

const joinBtn = document.querySelector('.join-poll'),
joinWindow = document.querySelector('.join-window');

joinBtn.addEventListener('click', () => {
    welcomeWindow.classList.add('hide');
    joinWindow.classList.remove('hide');

    const chooseIdBtn = document.querySelector('.choose-id-btn');
    chooseIdBtn.addEventListener('click', () => {
        let pollId = +document.querySelector('#poll-id').value;
        joinWindow.classList.add('hide');
        headWindow.classList.remove('hide');
        showHeadWindow(pollId);
    });
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

    getResource('http://localhost:3000/createdforms')
        .then(data => {
            console.log(data);

            const pollData = {};
            for (const [key, value] of data.entries()) {
                pollData[key] = value;
            }
            let currentPoll = pollData[id];
            console.log(currentPoll);
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
                
                postData('http://localhost:3000/answers', json)
                .then(data => {
                console.log(data);
                })
                .catch(error => console.error(error));
        
                headWindow.classList.add('hide');
                resultWindow.classList.remove('hide');
                showResults(id, currentPoll);
            });

            function addScale(i) {
                if (currentPoll['scale-type'] == 'numeric') {
                    let str = `<input type="number" min="1" max="5" name="answer-to-${temp}" value="0">`;
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
                else if (currentPoll['scale-type'] == 'video') {
                    let str = '';
                    for (let j = 1; j <= i; j++) {
                        str += `<input type="radio" name="answer-to-${temp}" value="${j}">
                            ${currentPoll['scale-src-'+j]}
                        </input>`
                    }
                    temp+=1;
                    return str;
                }
                else if (currentPoll['scale-type'] == 'image') {
                    let str = '';
                    for (let j = 1; j <= i; j++) {
                        str += `<input type="radio" name="answer-to-${temp}" value="${j}">
                            <img class='scale-img' src="${currentPoll['scale-src-'+j]}">
                        </input>`
                    }
                    temp+=1;
                    return str;
                }
            }
            
        });
}


// let range = document.querySelector('.range');
// let rangeL = document.querySelector('.range-label')

// setInterval (() => {
//         rangeL.textContent = range.value;
// }, 1);

//Result window

const resultWindow = document.querySelector('.result-window');

function showResults(id, currentPoll) {
    console.log(currentPoll);
    getResource('http://localhost:3000/answers')
    .then(data => {
        const answers = {};
        let counter = 0;
        for (const [key, value] of data.entries()) {
            answers[key] = value;
            counter++;
        }
        
        //обчислення
        let countOfAnswers = 0;
        let numOfAltern = 0;
        let answersAverage = {};
        let sum = 0;
        let answersDom = {};

        for (let i = 0; i < counter; i++) {
            let answer = answers[i];
            if (answer.pollId == id) {
                countOfAnswers++;
            }
        }

        for (key in currentPoll) {
            if (key.includes('altern-name')) {
                numOfAltern++;
            }
        }

        for (let j = 1; j <= numOfAltern; j++) {
            answersDom[j] = {'1':0,'2':0,'3':0,'4':0,'5':0};
        }

        console.log(answersDom);
        console.log('Відповідей: ' + countOfAnswers + ' ' + '\nК-сть альтернатив: ' + numOfAltern);
        
        for (let k = 1; k <= numOfAltern; k++) {
            for (let i = 0; i < counter; i++) {
                let answer = answers[i];
                if (answer.pollId == id) {
                    sum += +answer[`answer-to-${k}`];
                    answersDom[k][answer[`answer-to-${k}`]]++;
                }    
            }
            answersAverage[`answer-average-${k}`] = (sum / countOfAnswers).toFixed(2);
            sum = 0;
        }

        console.log(answersAverage);
        console.log(answersDom);

        resultWindow.innerHTML += `
            <div><h3>${currentPoll['name-poll']}</h3></div>
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

        function calcDom(numAlt) {
            let sumOfAnsw = 0;
            let res = '';

            for (let i = 1; i <= 5; i++) {
                sumOfAnsw += answersDom[numAlt][i];
            }
            for (let j = 1; j <= 5; j++) {
                answersDom[numAlt][j] = ((answersDom[numAlt][j]/sumOfAnsw) * 100).toFixed(2);
                if (answersDom[numAlt][j] >= 6.00) {
                    res += `<div class = "r${j}" style="width:${answersDom[numAlt][j]}%;">${answersDom[numAlt][j]}</div>`;
                } else if (answersDom[numAlt][j] <= 6.00 || answersDom[numAlt][j] > 0.00) {
                    res += `<div class = "r${j}" style="width:${answersDom[numAlt][j]}%;">&nbsp</div>`;
                }
            }
            
            return res;
        }
    });
}

