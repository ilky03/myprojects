const welcomeWindow = document.querySelector('.welcome-window'),
      createWindow = document.querySelector('.create-window'),
      createPollBtn = document.querySelector('.create-poll'),
      joinPollBtn = document.querySelector('.join-poll');

createPollBtn.addEventListener('click', () => {
    welcomeWindow.classList.add('hide');
    createWindow.classList.remove('hide');
});

joinPollBtn.addEventListener('click', () => {
    welcomeWindow.classList.add('hide');

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
    if (amountAltern == 0) {
        return;
    }
    createWindow.innerHTML += `
    <form action="#" class="create-form">
    <div>
        <label for="name-poll">Назва опитування</label> 
        <input id="name-poll" type="text" name="name-poll" required/>
    </div>
    <div>
        <label for="scale-type">Тип шкали оцінювання</label> 
        <select name="scale-type" "id="scale-type"> 
            <option selected disabled>Оберіть тип шкали</option>
            <option value="color">Кольорова</option>
            <option value="numeric">Числова</option>
            <option value="slider">Повзунок</option>
            <option value="video">Відео</option>
            <option value="image">Зображення</option>
        </select>
    </div>
    <div>
        <label for="altern-type">Тип альтернатив</label> 
        <select name="altern-type" id="altern-type">
            <option selected disabled>Оберіть тип альтернатив</option>
            <option value="text">Текст</option>
            <option value="image">Зображення</option>
            <option value="video">Відео</option>
        </select>
    </div>
    </form>
    `;
    const createForm = document.querySelector('.create-form');
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

    const form = document.querySelector('.create-form');

    form.addEventListener('submit', (event) => {
        event.preventDefault(); 
        let formData = new FormData(form);

        let json = JSON.stringify(Object.fromEntries(formData.entries()));

        postData('http://localhost:3000/createdforms', json)
        .then(data => {
        console.log(data);
        })
        .catch(error => console.error(error));

        createWindow.classList.add('hide');
        headWindow.classList.remove('hide');
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

function showHeadWindow(id) {

    const getResource = async (url) => {
        let res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }
        return await res.json(); 
    };

    getResource('http://localhost:3000/createdforms')
        .then(data => {
            console.log(data);

            const pollData = {};
            for (const [key, value] of data.entries()) {
                pollData[key] = value;
            }

            let currentPoll = pollData[id],
                numOfAltern = -4;
            for (key in currentPoll) {
                numOfAltern++;
            }
            
            headWindow.innerHTML += `
                <h4>${currentPoll['name-poll']}</h4>
                <form class="answer-form"></form>
            `;

            let answerForm = document.querySelector('.answer-form');

            if (currentPoll['altern-type'] == 'image') {
                // for (let i = 1; i <= 2; i++) {
                //     headWindow.innerHTML += `
                //         <img src="${}"
                //     `
                // }
            }
            else if (currentPoll['altern-type'] == 'text') {
                for (let i = 1; i <= numOfAltern; i++) {
                    let currentAltern = currentPoll[`${'altern-name-'+ i}`];
                    answerForm.innerHTML += `
                        <div>
                            <h5>${currentAltern}</h5>
                            <div>
                                ${addScale(i)}
                            </div>
                        </div>
                    `;
                }
            }
            else if (currentPoll['altern-type'] == 'video') {

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
            });

            function addScale(i) {
                if (currentPoll['scale-type'] == 'numeric') {

                }
                else if (currentPoll['scale-type'] == 'color') {
                    
                }
                else if (currentPoll['scale-type'] == 'slider') {
                    return `<input type="range" min="0" max="100" step="1" name="${'answer-'+i}"\>`;
                }
                else if (currentPoll['scale-type'] == 'video') {
                    
                }
                else if (currentPoll['scale-type'] == 'image') {
                    
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

