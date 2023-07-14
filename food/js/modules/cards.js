import { getResource } from "../services/services";

function cards() {

    class MenuCard {
        constructor(imgSrc, imgDescr, subTitle, descr, price, parentElement, ...classes) {
            this.imgSrc = imgSrc;
            this.imgDescr = imgDescr;
            this.subTitle = subTitle;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentElement);
        }

        render() {
            const div = document.createElement('div');

            if (this.classes.length === 0) {
                this.classes = "menu__item";
                div.classList.add(this.classes);
            } else {
                this.classes.forEach(className => div.classList.add(className));
            }

            div.innerHTML += `
                    <img src=${this.imgSrc} alt=${this.imgDescr}>
                    <h3 class="menu__item-subtitle">Меню "${this.subTitle}"</h3>
                    <div class="menu__item-descr">${this.descr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                    </div>
            `;

            this.parent.append(div);
        }
    }

    getResource('http://localhost:3000/menu')
        .then(data => {
            data.forEach(({img, altimg, title, descr, price}) => {
                new MenuCard(img, altimg, title, descr, price * 27, '.menu__field .container').render();
            });
        });
    
}

export default cards;