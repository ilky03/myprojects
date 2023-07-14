function calc() {

    let calcRes = document.querySelector('.calculating__result span');
    let sex, height, weight, age, activity;

    if (localStorage.getItem('sex')) {
        sex = localStorage.getItem('sex');
    } else {
        sex = 'female';
        localStorage.setItem('sex', sex);
    }

    if (localStorage.getItem('activity')) {
        activity = localStorage.getItem('activity');
    } else {
        activity = 1.375;
        localStorage.setItem('activity', activity);
    }

    function initLocalSettings(selector, activeClass) {
        let elements = document.querySelectorAll(selector);
        elements.forEach(elem => {
            elem.classList.remove(activeClass);

            if (elem.getAttribute('id') === localStorage.getItem('sex')) {
                elem.classList.add(activeClass);
            }

            if (elem.getAttribute('data-activity') === localStorage.getItem('activity')) {
                elem.classList.add(activeClass);
            }
        });
    }

    initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active');
    initLocalSettings('#gender div', 'calculating__choose-item_active');

    calcCalories();

    function calcCalories() {
        if (!sex || !height || !weight || !age || !activity) {
            calcRes.textContent = '____';
            return;
        }
        const bmr = sex == 'male' 
        ? 88.36 + 13.4 * weight + 4.8 * height - 5.7 * age
        : 447.6 + 9.2 * weight + 3.1 * height - 4.3 * age;

        calcRes.textContent = Math.round(bmr * activity);
    }

    function getStaticData(parentSelector, activeClass) {
        const elements = document.querySelectorAll(parentSelector);
        console.log(elements);

        elements.forEach(elem => {
            elem.addEventListener('click', (e) => {
                if (e.target.getAttribute('data-activity')) {
                    activity = +e.target.getAttribute('data-activity');
                    localStorage.setItem('activity', activity)
                } else {
                    sex = e.target.getAttribute('id');
                    localStorage.setItem('sex', sex);
                }

                elements.forEach(elem => {
                    elem.classList.remove(activeClass);
                });

                e.target.classList.add(activeClass);
                calcCalories();
            });
        });
    }

    getStaticData('.calculating__choose_big div', 'calculating__choose-item_active');
    getStaticData('#gender div', 'calculating__choose-item_active');

    function getDynamicData(selector) {
        const input = document.querySelector(selector);
        input.addEventListener('input', () => {
            if (input.value.match(/\D/g)) {
                input.style.border = '1px solid red';
            } else {
                input.style.border = 'none';
            }

            switch(input.getAttribute('id')) {
                case "height":
                    height = +input.value;
                    break;
                case "weight":
                    weight = +input.value;
                    break;
                case "age":
                    age = +input.value;
                    break;
            }

            calcCalories();
        });
    }

    getDynamicData('#weight');
    getDynamicData('#height');
    getDynamicData('#age');

}

export default calc;