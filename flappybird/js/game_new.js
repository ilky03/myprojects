let cvs = document.getElementById('canvas');
let ctx = cvs.getContext('2d');

cvs.width = window.innerWidth;
cvs.height = window.innerHeight;

class Character {
    constructor(name, health, speed, skinSrc) {
        this.name = name;
        this.health = health;
        this.speed = speed;
        this.xPos = 100;
        this.yPos = 150;
        this.skin = new Image();
        this.skin.src = skinSrc;
    }
}

class Player {
    constructor(nickname) {
        this.nickname = nickname;
        this.maxScore = 0;
        this.numOfGames = 0;
    }

    get Score() {
        return this.maxScore;
    }
    set Score(score) {
        if (this.maxScore < score) {
            this.maxScore = score;
        }
    }

    NumOfGames() {
        this.numOfGames += 1;
    }
}

class Map {
    constructor(mapSrc, gravity, pipeUpSrc, pipeBottomSrc) {
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

}

let bg1 = new Map('img/bg-1.jpg', 1.5, 'img/pipeUp.png', 'img/pipeBottom.png');

let bird = new Character('bird', 3, 25, 'img/bird.png');
let gap = 90;

document.addEventListener("keydown", moveUp);

function moveUp() {
    bird.yPos -= 25;
}

let pipe = [];
pipe[0] = {
    x: cvs.width,
    y: 0
}
let a = 500;
function draw() {
    ctx.drawImage(bg1.map, 0, 0, cvs.width, cvs.height)

    for (let i = 0; i < pipe.length; i++) {
        ctx.drawImage(bg1.pipeUp, pipe[i].x, pipe[i].y);
        ctx.drawImage(bg1.pipeBottom, pipe[i].x, pipe[i].y + 400);

        pipe[i].x--;

        if (pipe[i].x === cvs.width-200) {
            pipe.push({
                x: cvs.width,
                y: Math.trunc(Math.random() * 100)
            })
        }
       // pipe[i].x--;

       // if (pipe[i].x === 1200) {
      //      pipe.push({
     //           x: cvs.width,
     //           y: Math.floor(Math.random() * bg1.pipeUp.height) - bg1.pipeUp.height
      //      });
        }

        ctx.drawImage(bird.skin, bird.xPos, bird.yPos);

        bird.yPos += bg1.gravity;

        requestAnimationFrame(draw);
}

let newbg = new Image();
newbg.src = 'img/bg-1.jpg';
newbg.onload = draw;
