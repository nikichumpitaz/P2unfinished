// some global variables
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;
let imgs = []; 
let numImgs = 10;
let msgs = [
    {
      "xPos": 100,
      "yPos": 150,
      "message": "Aight, is this working?"
    },
    {
        "xPos": 50,
        "yPos": 50,
        "message": "good job us"
      },
    {
        "xPos": 100,
        "yPos": 100,
        "message": "unless this fails"
    },
    {
        "xPos": 200,
        "yPos": 200,
        "message": "we'll see what happens"
      },
      {
        "xPos": 75,
        "yPos": 75,
        "message": "tesssf?"
      },
      {
        "xPos": 100,
        "yPos": 100,
        "message": "messageer?"
      },
      {
        "xPos": 100,
        "yPos": 100,
        "message": "messageer?"
      },
      {
        "xPos": 100,
        "yPos": 100,
        "message": "messageer?"
      },
      {
        "xPos": 100,
        "yPos": 100,
        "message": "messageer?"
      },
      {
        "xPos": 100,
        "yPos": 100,
        "message": "messageer?"
      }
  ];
let level;
let hiddenMessage;
let counter = 0;
let numLevels;
let girl;
let girlAnim;
let score = 0; 
let gameOver = false;


function preload(){
  //load the player image
    const girlSpritesheet = loadSpriteSheet("img/girl.png", 150, 150, 13);
    girlAnim = loadAnimation(girlSpritesheet);
    girl = createSprite(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 150, 150);
    girl.moveSpeed = 2;
  //load the background images
  imgs[0] = loadImage("img/0.png");
  imgs[1] = loadImage("img/1.png");
  imgs[2] = loadImage("img/2.png");
  imgs[3] = loadImage("img/3.png");
  imgs[4] = loadImage("img/4.png");
  imgs[5] = loadImage("img/5.png");
  imgs[6] = loadImage("img/6.png");
  imgs[7] = loadImage("img/7.png");
  imgs[8] = loadImage("img/8.png");
  imgs[9] = loadImage("img/9.png");

  // msgs1 = new Message(20, 250, "Aight, is this working?");
  // msgs2 = new Message(20, 250, "Aight, is this working?");
  // msgs3 = new Message(20, 250, "Aight, is this working?");
  // msgs4 = new Message(20, 250, "Aight, is this working?");
  // msgs5 = new Message(20, 250, "Aight, is this working?");
  // msgs6 = new Message(20, 250, "Aight, is this working?");
  // msgs7 = new Message(20, 250, "Aight, is this working?");
  // msgs8 = new Message(20, 250, "Aight, is this working?");
  // msgs9 = new Message(20, 250, "Aight, is this working?");
}



function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  numLevels = imgs.length;
  girl.addAnimation("move", girlAnim);
  girl.addImage("still", loadImage("img/girl_still.png"));
  
  // girl.setDefaultCollider();
  for(var i=0; i <numImgs; i++){
    girl.setCollider('circle', -1, 1, 25);
  }
  //check the start game function way at the bottom to see what we do there
  startGame();  
}


function reverseAtEdges(){
  //all sprites bounce at the screen edges
  for(var i=0; i<allSprites.length; i++) {
    var s = allSprites[i];
    if(s.position.x<0) {
      s.position.x = 1;
      s.velocity.x = abs(s.velocity.x);
    }

    if(s.position.x>width) {
      s.position.x = width-1;
      s.velocity.x = -abs(s.velocity.x);
    }

    if(s.position.y<180) {
      s.position.y = 181;
      s.velocity.y = abs(s.velocity.y);
    }

    if(s.position.y>height) {
      s.position.y = height-1;
      s.velocity.y = -abs(s.velocity.y);
    }
  }
}




function update(object) {
  if (keyDown("up") || keyDown("down") || keyDown("left") || keyDown("right")) {
    if (keyDown("up")) {
      object.addSpeed(2, 270);
    }
    if (keyDown("down")) {
      object.addSpeed(2, 90);
    }
    if (keyDown("left")) {
      object.addSpeed(2, 180);
      object.mirrorX(-1);
    }
    if (keyDown("right")) {
      object.addSpeed(2, 0);
      object.mirrorX(1);
    }
  } else {
    object.setSpeed(0);
  }
  drawObject(object);
}

function drawObject(object) {
  if (object.getSpeed() > 0.0001) {
    object.changeAnimation("move");
  } else {
    object.changeImage("still");
  }
  girl.limitSpeed(girl.moveSpeed);
  drawSprite(object);
}

//our player constructor, gets remade for every level
class Player{
  constructor(targetX, targetY){
  this.x = 0;
  this.y = 180;
  this.width = 30;
  this.height = 90;
  this.targetX = targetX;
  this.targetY = targetY;
  this.atGoal = false;
  }
  
  //draw the player
  display(){
    image(girlAnim, this.x, this.y, this.width,this.height);  
  }
}

//a function to make a new door for each level
class Door{
  constructor(){
    this.width = 40;
    this.height = 90;
    this.x = 360;
    this.y = 310;
    this.handleX = this.x + this.width*0.9;
    this.handleY = this.y + this.height*0.5;
    this.insetX = this.x+ this.width*0.15;
    this.insetY1 = this.y + this.height*0.1;
    this.insetY2 = this.y + this.height*0.6;
    this.insetWidth = this.width * 0.7;
    this.insetHeight = this.height*0.3;
  }

  //draw the door and handle
  display(){
  
    //door
      fill(40,26,13);
      rect(this.x, this.y, this.width, this.height);
    
    //insets
          fill(80,46,23);
      rect(this.insetX, this.insetY1, this.insetWidth, this.insetHeight);
          rect(this.insetX, this.insetY2, this.insetWidth, this.insetHeight);
      
    //handle
      fill(255, 255, 0);
      ellipse(this.handleX, this.handleY, this.width/8);
  }
} 

function createTextBox(message, posX, posY) {
    fill(245, 240, 206);
    rect(1, 512, 702, 100, 10, 10, 10, 10);
    textSize(24);
    fill(0, 0, 0);
    text(message, posX, posY, 200, 250);
}



//this is a class which keeps track of all the aspects of a level
class Level{
 
constructor(img){
    this.bg = img;
    this.door = new Door();
    this.targetX = this.door.handleX;
    this.targetY = this.door.handleY;
    this.complete = false;
}

//build an array of messages and counter++

  //draw the level
  display(){
    image(this.bg, 0, 0, width, height);
    this.door.display();

    //draw score
    drawScoreBox();
    drawScore();


  }
}

//make a white box to show the scoreboard in
function drawScoreBox(){
  fill(255);
  noStroke();
  rect(0,0,width, 20);
}

//draw current score to the screen
function drawScore(){
  fill(0);
  textSize(20);
  text("score: ", 10,15);
  text(score, 70, 15)
}



function drawGame(){
    //the level has a player which has a method to check to see if it reached the goal
    // level.player.checkGirl();
 

  //check if the girl is near the doorknob
  // checkGirl(){
  //     let goal = dist(this.x + this.width/2, this.y, this.targetX, this.targetY);

  //     if(goal < 20 ){
  //       this.atGoal = true;
  //     }  
  // }
    let targetX = level.door.handleX;
    let targetY = level.door.handleY;
    let goal = dist(girl.position.x, girl.position.y, targetX, targetY);
    if(goal < 20){
      level.complete = true;
    }


  //if the player has reached the goal then update the counter and make a new level
  // if(level.player.atGoal){
  //     score++
  //     counter++
  //     level = new Level(imgs[counter%imgs.length]);  
  // } 

    if(level.complete){
          score++
          counter++
          level = new Level(imgs[counter%imgs.length]); 

          //showMessage(msgs[counter%msgs.length].message, msgs[counter%msgs.length].xPos, msgs[counter%msgs.length].yPos);
          console.log(msgs[counter%msgs.length].xPos);
          console.log(msgs[counter%msgs.length].yPos);
          console.log(msgs[counter%msgs.length].message);
          girl.position.x = 15;
          girl.position.y = 310;
    }


    //display the level
    level.display(); 
   
}

//gets called when the time runs out
function drawGameOver(){
  fill(255);
  text('game over', 100, 200);
  text('click to restart', 100, 250);
}

//if the game is over and we click, start the game again
function mousePressed(){
  if(gameOver){
    startGame();
  }
}
//reset all the global variables to the initial state and make a new Level
function startGame(){
    score = 0;
    gameOver = false;
    level = new Level(imgs[counter]);
    function showMessage(){
      createTextBox(msgs[counter%msgs.length].message, msgs[counter%msgs.length].xPos, msgs[counter%msgs.length].yPos)
    }
    showMessage();
    // showMessage(msgs[counter%msgs.length].message, msgs[counter%msgs.length].xPos, msgs[counter%msgs.length].yPos);
    
    console.log(msgs[counter].xPos);
    console.log(msgs[counter].yPos);
    console.log(msgs[counter].message);
}


function draw() {
  reverseAtEdges();  
  //if the game isn't over then draw the game
  if(!gameOver){
    drawGame();
  } else {
    //if the game is over draw the game over screen
    background(0)
    drawGameOver();
  }

  update(girl);
}