let cvs = document.getElementById('canvas');
let ctx = cvs.getContext('2d');

cvs.width = window.innerWidth;
cvs.height = window.innerHeight;

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

let bg1 = new Map('img/bg-1.jpg', 1.5, 'img/pipeUp_bg-1.png', 'img/pipeBottom_bg-1.png');

let bird = new Character('bird', 3, 25, 'img/bird.png');
let gap = 100;

document.addEventListener("keydown", moveUp);

function moveUp() {
    bird.yPos -= 25;
}

let hp = new Image();
hp.src = "img/hp.png";
let hp2 = new Image();
hp2.src = "img/hp2.png";

let score = 0;
let flag = 0;
let pipe = [];
pipe[0] = {
    x: cvs.width,
    y: -300
}

function draw() {
    ctx.drawImage(bg1.map, 0, 0, cvs.width, cvs.height)

    for (let i = 0; i < pipe.length; i++) {
        ctx.drawImage(bg1.pipeUp, pipe[i].x, pipe[i].y);
        ctx.drawImage(bg1.pipeBottom, pipe[i].x, pipe[i].y + bg1.pipeUp.height + gap);

        pipe[i].x--;

        if (pipe[i].x === cvs.width-200) {
            pipe.push({
                x: cvs.width,
                y: Math.trunc(Math.random() * 300) - 300
            })
        }

        if(((bird.xPos + bird.skin.width > pipe[i].x
                && bird.xPos < pipe[i].x + bg1.pipeUp.width
                && (bird.yPos < pipe[i].y + bg1.pipeUp.height
                    || bird.yPos + bird.skin.height > pipe[i].y + bg1.pipeUp.height + gap))
            || bird.yPos > cvs.height || bird.yPos < 0) && flag === 0) {
            if(bird.health > 0) {
                bird.health--;
            } else {
                alert('freeze');
                location.reload();
            }
            flag = 1;
            setTimeout(() => flag = 0, 1500);
        }

        if (pipe[i].x === 100) {
            score++;
        }

        if (bird.health === 3) {
            ctx.drawImage(hp, 10, 10);
            ctx.drawImage(hp, 50, 10);
            ctx.drawImage(hp, 90, 10);
        } else if (bird.health === 2) {
            ctx.drawImage(hp, 10, 10);
            ctx.drawImage(hp, 50, 10);
            ctx.drawImage(hp2, 90, 10);
        } else if(bird.health === 1) {
            ctx.drawImage(hp, 10, 10);
            ctx.drawImage(hp2, 50, 10);
            ctx.drawImage(hp2, 90, 10);
        } else {
            ctx.drawImage(hp2, 10, 10);
            ctx.drawImage(hp2, 50, 10);
            ctx.drawImage(hp2, 90, 10);
        }

    }

    ctx.drawImage(bird.skin, bird.xPos, bird.yPos);

    bird.yPos += bg1.gravity;

    ctx.fillStyle = "#000";
    ctx.font = "15px PixelFont";
    ctx.fillText("SCORE: " + score, 10, cvs.height - 20);

    requestAnimationFrame(draw);
}

let img = new Image();
img.src = "img/bg-1.jpg";
img.onload = draw;