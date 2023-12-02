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
                    <h3 class="menu__item-subtitle">Menu "${this.subTitle}"</h3>
                    <div class="menu__item-descr">${this.descr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Price:</div>
                        <div class="menu__item-total"><span>${this.price}</span> uah/day</div>
                    </div>
            `;

            this.parent.append(div);
        }
    }
    let data = [
              {
                "img": "img/tabs/vegy.jpg",
                "altimg": "vegy",
                "title": "Fitness Menu",
                "descr": "The 'Fitness' menu is a new approach to preparing dishes: more fresh vegetables and fruits. Designed for active and healthy individuals. It is an entirely new product with an optimal price and high quality!",
                "price": 9
              },
              {
                "img": "img/tabs/post.jpg",
                "altimg": "post",
                "title": "Post Menu",
                "descr": "The 'Post' menu involves a careful selection of ingredients: complete absence of animal products, almond, oat, coconut, or buckwheat milk, the right amount of proteins through tofu and imported vegetarian steaks.",
                "price": 14
              },
              {
                "img": "img/tabs/elite.jpg",
                "altimg": "elite",
                "title": "Premium Menu",
                "descr": "In the 'Premium' menu, we use not only beautiful packaging design but also high-quality dish execution. Salmon, seafood, fruits - a restaurant menu without going to a restaurant!",
                "price": 21
              }
    ]       

    data.forEach(({img, altimg, title, descr, price}) => {
        new MenuCard(img, altimg, title, descr, price * 27, '.menu__field .container').render();
    });

    // getResource('http://localhost:3000/menu')
    //     .then(data => {
    //         data.forEach(({img, altimg, title, descr, price}) => {
    //             new MenuCard(img, altimg, title, descr, price * 27, '.menu__field .container').render();
    //         });
    //     });
    
}

export default cards;