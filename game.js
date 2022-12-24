let monsta;
let hero;
let lvl;
let screen = 0;

function setup() {
    createCanvas(600, 400);
    monsta = new Map(600, 400);
    hero = new Hero(30, 30, 60, 280, 100, 0);
    lvl = new Level(0, 0, 0);
    lvl.setLevel(1)
    monsta.init(1)
}
  
function draw() {
    if(screen == 0){
        background(0);
        fill(255);
        textAlign(CENTER);
        text('Wirda (21177051059)', width / 2, height / 2 - 40);
        text('Mutiara (2117051013)', width / 2, height / 2 - 20);
        text('Adhistia (2117051065)', width / 2, height / 2);
        text('Click to Start !', width / 2, height / 2 + 40);
    }
    else if(screen == 1){
        background(110, 200, 255);
        monsta.ground();
        fill(0)
        text('Level: ' + lvl.currentLevel, 500, 35);
        text('Darah: ' + hero.life, 500, 50);
        text('Score: ' + hero.score, 500, 65);
        hero.show();
        hero.move();

        for(let pelor of hero.peluru){
            pelor.show();
        }
        
        for(let monsters of monsta.enemy){
            monsters.show();
            if(dist(monsters.x, monsters.y, hero.x, hero.y) < 48){
                monsta.enemy.splice(monsta.enemy.indexOf(monsters), 1);
                if(monsters.effect == 1){
                    hero.addLife(10);
                }
                else{
                    hero.calculateLife(10)
                }
            }
        }

        if(hero.life <= 0){
            if(lvl.maxLevel < lvl.getCurrentLevel()){
                lvl.maxLevel = lvl.getCurrentLevel();
            }
            screen = 2;
        }

        for(let monsters of monsta.enemy){
            for(let pelor of hero.peluru){
                if(dist(monsters.x, monsters.y, pelor.x, pelor.y) < 20){
                    monsta.enemy.splice(monsta.enemy.indexOf(monsters), 1);
                    if(monsters.effect == 0){
                        hero.increaseScore()
                    }
                    if(hero.score % 10 == 0){
                        lvl.latestLevel = lvl.getCurrentLevel();
                        lvl.setLevel(lvl.getCurrentLevel() + 1)
                    }
                    hero.peluru.splice(hero.peluru.indexOf(pelor), 1);
                }
            }
            if(monsters.x < 0){
                monsta.enemy.splice(monsta.enemy.indexOf(monsters), 1);
                let xE = random(600, 1600);
                monsters = new Monster(10, 20, xE, 300);
                monsta.enemy.push(monsters)
            }
        }
        if(monsta.enemy.length < 1){
            monsta.init(1);
        }
        
    }
    else{
        background(0);
        textAlign(CENTER);
        fill(255)
        text('GAME OVER', width / 2, height / 2);
        fill(255)
        text('highest Level : ' + lvl.maxLevel, width / 2, height / 2 + 20);
    }
}

function keyPressed(){
    if(keyCode === 32){
        hero.attack();
    }
}

function mousePressed(){
    if(screen == 0){
        screen = 1
        monsta.init(1)
    }
    else if(screen == 2){
        screen = 0
        hero.score = 0;
        hero.life = 100;
        hero.x = 60;
        hero.y = 280;
        lvl.setLevel(1)
    }
}

class Entity{
    constructor(height, width, x, y){
        this.height = height;
        this.width = width;
        this.x = x;
        this.y = y;
        this.peluru = [];
    }
    attack(){
        let pelor = new Peluru(hero.x + 5, hero.y + 15);
        this.peluru.push(pelor);
    }
    moveRight(){
        if(this.x < 570){
            this.x += 1;
        }
    }
    moveLeft(){
        if(this.x > 0){
            this.x -= 1;
        }
    }
    moveDown(){
        if(this.y < 280){
            this.y += 1;
        }
    }
    moveUp(){
        if(this.y > 0){
            this.y -= 1;
        }
    }
}

class Hero extends Entity{
    constructor(height, width, x, y, life, score){
        super(height, width, x, y);
        this.life = life;
        this.score = score;
    }
    show(){
        noStroke();
        fill(120, 120, 120);
        square(this.x, this.y, this.width);
    }
    move(){
        if(keyIsDown(RIGHT_ARROW)){
            this.moveRight();
        }
        else if(keyIsDown(LEFT_ARROW)){
            this.moveLeft();
        }
    }
    increaseScore(){
        this.score += 1;
    }
    calculateLife(darah){
        this.life -= darah;
    }
    addLife(darah){
        if(this.life + darah > 100){
            this.life = 100;
        }
        else{
            this.life += darah;
        }
    }
}
