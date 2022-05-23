let cvs = document.getElementById('canvas');
let ctx = cvs.getContext('2d');

cvs.width = window.innerWidth;
cvs.height = window.innerHeight;

cvs.style.display = 'none';

class Character {
    constructor(name, health, speed, skinSrc) {
        this.name = name;
        this.health = health;
        this.speed = speed;
        this.skin = new Image();
        this.skin.src = skinSrc;
        this.xPos = 100;
        this.yPos = 150;
    }

}

class Player {
    constructor(nickname) {
        this.nickname = nickname;
        this.highScore = 0;
    }

    setScore(score) {
        if (this.highScore < score) {
            this.highScore = score;
        }
    }
}

class Map {
    constructor(name, mapSrc, gravity, pipeUpSrc, pipeBottomSrc) {
        this.name = name;
        this.map = new Image();
        this.map.src = mapSrc;
        this.pipeUp = new Image();
        this.pipeUp.src = pipeUpSrc;
        this.pipeBottom = new Image();
        this.pipeBottom.src = pipeBottomSrc;
        this.gravity = gravity;
    }

}

class RatingTable {
    constructor() {
        this.user1 = JSON.parse(localStorage.getItem('user1'));
        this.user2 = JSON.parse(localStorage.getItem('user2'));
        this.user3 = JSON.parse(localStorage.getItem('user3'));
    }

    makeRating(nickname, highScore, mapName, birdName) {
        if (highScore > this.user3[1]) {
            if (highScore > this.user2[1]) {
                if (highScore > this.user1[1]) {
                    localStorage.setItem('user1', JSON.stringify([nickname, highScore, mapName, birdName]));
                } else {
                    localStorage.setItem('user2', JSON.stringify([nickname, highScore, mapName, birdName]));
                }
            } else {
                localStorage.setItem('user3', JSON.stringify([nickname, highScore, mapName, birdName]));
            }
        }
    }
}


let bg1 = new Map('forest','img/backgrounds/bg-1/bg.jpg', 1.8, 'img/backgrounds/bg-1/pipeUp.png', 'img/backgrounds/bg-1/pipeBottom.png');
let bg2 = new Map('classic', 'img/backgrounds/bg-2/bg.jpg', 1.8, 'img/backgrounds/bg-2/pipeUp.png', 'img/backgrounds/bg-2/pipeBottom.png');
let bg3 = new Map('space','img/backgrounds/bg-3/bg.jpg', 1, 'img/backgrounds/bg-3/pipeUp.png', 'img/backgrounds/bg-3/pipeBottom.png');
let bg4 = new Map('minecraft','img/backgrounds/bg-4/bg.jpg', 1.8, 'img/backgrounds/bg-4/pipeUp.png', 'img/backgrounds/bg-4/pipeBottom.png');

let bird = new Character('bird', 3, 25, 'img/characters/bird_game.png');
let heroBird = new Character('heroBird', 3, 25, 'img/characters/heroBird_game.png');
let ironBird = new Character('ironBird', 4, 25, 'img/characters/ironBird_game.png');
let swagBird = new Character('swagBird', 3, 35, 'img/characters/swagBird_game.png');
let player;

////////////////////////////////////////////////////////////////////
let startButton = document.getElementById('start_button');
let nickname = "User";
startButton.onclick = () => {
    nickname = document.getElementById('nickname').value;
    if (nickname === '') {
        nickname = 'User'
    }
    player = new Player(nickname);
    document.getElementById('head_container').style.display = 'none';
    cvs.style.display = 'block';
    draw();
}

let changeSkinButton = document.getElementById('change_skin_button');
let descrAboutChar = document.getElementById('descr_skin');
let skinSrc = document.getElementById("skin_img");
let skinAtThisMoment = bird;
descrAboutChar.innerHTML = '+nothing :)'
changeSkinButton.onclick = () => {
    if (skinAtThisMoment === bird) {
        skinSrc.src = "img/characters/heroBird.png";
        skinAtThisMoment = heroBird;
        descrAboutChar.innerHTML = '+antigravity'
    } else if (skinAtThisMoment === heroBird) {
        skinSrc.src = "img/characters/ironBird.png";
        skinAtThisMoment = ironBird;
        descrAboutChar.innerHTML = '+1hp'
    } else if (skinAtThisMoment === ironBird) {
        skinSrc.src = "img/characters/swagBird.png";
        skinAtThisMoment = swagBird;
        descrAboutChar.innerHTML = '+jump'
    } else {
        skinSrc.src = "img/characters/bird.png";
        skinAtThisMoment = bird;
        descrAboutChar.innerHTML = '+nothing :)'
    }
}

let changeMapButton = document.getElementById('change_map_button');
let mapSrc = document.getElementById('map');
let mapAtThisMoment = bg1;
changeMapButton.onclick = () => {
    if (mapAtThisMoment === bg1) {
        mapSrc.src = 'img/backgrounds/bg-2/bg.jpg';
        mapAtThisMoment = bg2;
    } else if (mapAtThisMoment === bg2) {
        mapSrc.src = 'img/backgrounds/bg-3/bg.jpg';
        mapAtThisMoment = bg3;
    } else if (mapAtThisMoment === bg3) {
        mapSrc.src = 'img/backgrounds/bg-4/bg.jpg';
        mapAtThisMoment = bg4;
    } else {
        mapSrc.src = 'img/backgrounds/bg-1/bg.jpg';
        mapAtThisMoment = bg1;
    }
}
//////////////////////////////////////////////////

let gap = 100;

document.addEventListener("click", moveUp);
document.addEventListener("keypress", moveUp);

function moveUp() {
    skinAtThisMoment.yPos -= skinAtThisMoment.speed;
}

let hp = new Image();
hp.src = "img/hp.png";
let hp2 = new Image();
hp2.src = "img/hp2.png";

let score = 0;
let flag = 0;
let flag2 = 0;
let pipe = [];
pipe[0] = {
    x: cvs.width,
    y: -300
}

function draw() {
    ctx.drawImage(mapAtThisMoment.map, 0, 0, cvs.width, cvs.height)

    for (let i = 0; i < pipe.length; i++) {
        ctx.drawImage(mapAtThisMoment.pipeUp, pipe[i].x, pipe[i].y);
        ctx.drawImage(mapAtThisMoment.pipeBottom, pipe[i].x, pipe[i].y + mapAtThisMoment.pipeUp.height + gap);

        pipe[i].x--;

        if (pipe[i].x === cvs.width-200) {
            pipe.push({
                x: cvs.width,
                y: Math.trunc(Math.random() * 300) - 300
            })
        }

        if(((skinAtThisMoment.xPos + skinAtThisMoment.skin.width > pipe[i].x
                && skinAtThisMoment.xPos < pipe[i].x + mapAtThisMoment.pipeUp.width
                && (skinAtThisMoment.yPos < pipe[i].y + mapAtThisMoment.pipeUp.height
                    || skinAtThisMoment.yPos + skinAtThisMoment.skin.height > pipe[i].y + mapAtThisMoment.pipeUp.height + gap))
            || skinAtThisMoment.yPos > cvs.height || skinAtThisMoment.yPos < 0) && flag === 0) {
            if(skinAtThisMoment.health > 0) {
                skinAtThisMoment.health--;
            } else {
                flag2 = 1;
                cvs.style.display = 'none';
                player.setScore(score);
                let ratingTable = new RatingTable();
                ratingTable.makeRating(player.nickname, player.highScore, mapAtThisMoment.name, skinAtThisMoment.name);

                let tableHTML = document.getElementById('table_score');
                tableHTML.innerHTML = '<h1>GAME OVER</h1><p><img src= "img/rip.gif" class="rip_gif"></p><h4>HIGHSCORE TABLE</h4><table><tr><th>Nickname</th><th>HighScore</th><th>Map</th><th>Bird</th></tr>'+
                    `<tr><th>${ratingTable.user1[0]}</th><th>${ratingTable.user1[1]}</th><th>${ratingTable.user1[2]}</th><th>${ratingTable.user1[3]}</th></th>`+
                    `<tr><th>${ratingTable.user2[0]}</th><th>${ratingTable.user2[1]}</th><th>${ratingTable.user2[2]}</th><th>${ratingTable.user2[3]}</th></th>`+
                    `<tr><th>${ratingTable.user3[0]}</th><th>${ratingTable.user3[1]}</th><th>${ratingTable.user3[2]}</th><th>${ratingTable.user3[3]}</th></th></table>`+
                    '<p>Press any button or tap the screen to start a new game</p>'

                setTimeout(()=> {
                    document.addEventListener("click", reload);
                    document.addEventListener("keypress", reload);
                }, 2000);

                function reload() {
                    location.reload();
                }
            }
            flag = 1;
            setTimeout(() => flag = 0, 1500);
        }

        if (pipe[i].x === 100) {
            score++;
        }


        if (skinAtThisMoment.health === 4) {
            ctx.drawImage(hp, 10, 10);
            ctx.drawImage(hp, 50, 10);
            ctx.drawImage(hp, 90, 10);
            ctx.drawImage(hp, 130, 10);
        } else if (skinAtThisMoment.health === 3) {
            ctx.drawImage(hp, 10, 10);
            ctx.drawImage(hp, 50, 10);
            ctx.drawImage(hp, 90, 10);
        } else if (skinAtThisMoment.health === 2) {
            ctx.drawImage(hp, 10, 10);
            ctx.drawImage(hp, 50, 10);
            ctx.drawImage(hp2, 90, 10);
        } else if(skinAtThisMoment.health === 1) {
            ctx.drawImage(hp, 10, 10);
            ctx.drawImage(hp2, 50, 10);
            ctx.drawImage(hp2, 90, 10);
        } else {
            ctx.drawImage(hp2, 10, 10);
            ctx.drawImage(hp2, 50, 10);
            ctx.drawImage(hp2, 90, 10);
        }

    }

    ctx.drawImage(skinAtThisMoment.skin, skinAtThisMoment.xPos, skinAtThisMoment.yPos);

    if (skinAtThisMoment.name === 'heroBird') {
        skinAtThisMoment.yPos += mapAtThisMoment.gravity*1.5;
    } else {   skinAtThisMoment.yPos += mapAtThisMoment.gravity;}


    ctx.fillStyle = "#000";
    ctx.font = "15px PixelFont";
    ctx.fillText("SCORE: " + score, 10, cvs.height - 20);

    if (flag2 === 0) {
        requestAnimationFrame(draw);
    }
}
