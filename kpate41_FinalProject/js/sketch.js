let isBroken;
let healthCounter;
let enemyHealthCounter;
let previousAttackTime;
let currentAttackTime;

function setup() {
  createCanvas(1000, 1000);

  var mgr = new SceneManager();
  mgr.wire();
  mgr.showScene(startMenuScene);

  frameRate(50);
}

//function draw() {}

function startMenuScene() {
  this.draw = function(){
    background(100, 0, 0);
    textSize(80);
    fill(255, 255, 255);
    text("A Shot in the Dark", 150, 180);
    textSize(32);
    text("Kill the RED enemy by aligning your view over it 3 times,\n      before it destroys all your BLUE Charge Crystals.", 120, 500);
    text("Use the mouse to move", 310, 640);
    text("Press ENTER to start the game", 250, 800);
  }

  this.keyPressed = function(){
    if (keyCode == ENTER){
      this.sceneManager.showScene(gameLoopScene, key);
    }
  }
}

function gameLoopScene() {
  healthCounter = 3;
  enemyHealthCounter = 3;
  previousAttackTime = 0;
  currentAttackTime = 0;

  let player = new Circle();
  player.size = 40;
  player.color = "whitesmoke";

  let crystal1 = new ChargeCrystal();
  let crystal2 = new ChargeCrystal();
  let crystal3 = new ChargeCrystal();
  let enemy1 = new Enemy();


  this.draw = function(){
    background(0, 0, 0);
    textSize(32);
    fill(0, 220, 200);
    text("Health Remaining: " + healthCounter, 640, 970);
    fill(220, 0, 0);
    text("Enemy Health Remaining: " + enemyHealthCounter, 30, 970);
    

    player.x = mouseX;
    player.y = mouseY;
    player.show();

    crystal1.crystalMotion();
    crystal1.show();
    crystal2.crystalMotion();
    crystal2.show();
    crystal3.crystalMotion();
    crystal3.show();
    enemy1.enemyMotion();
    enemy1.show();
    
    let enemyDist = dist(crystal1.ccX, crystal1.ccY, enemy1.eX, enemy1.eY);
    if(enemyDist < 60 && crystal1.isBroken == false){
      crystal1.ccColor = color(10, 10, 255, 50);
      crystal1.isBroken = true;
      healthCounter -= 1;
    }

    let enemyDist2 = dist(crystal2.ccX, crystal2.ccY, enemy1.eX, enemy1.eY);
    if(enemyDist2 < 60 && crystal2.isBroken == false){
      crystal2.ccColor = color(10, 10, 255, 50);
      crystal2.isBroken = true;
      healthCounter -= 1;
    }

    let enemyDist3 = dist(crystal3.ccX, crystal3.ccY, enemy1.eX, enemy1.eY);
    if(enemyDist3 < 60 && crystal3.isBroken == false){
      crystal3.ccColor = color(10, 10, 255, 50);
      crystal3.isBroken = true;
      healthCounter -= 1;
    }

    let playerDist4 = dist(enemy1.eX, enemy1.eY, player.x, player.y);
    if(playerDist4 < 40){
      currentAttackTime = millis() - previousAttackTime;
      if(currentAttackTime > 3000){
        previousAttackTime = millis();
        currentAttackTime = 0;
        enemy1.eColor = color(255, 10, 10, 255);
        enemy1.xpos = random(350, 650);
        enemy1.ypos = random(350, 650);
        enemyHealthCounter -= 1;
      }
    }else {
      enemy1.eColor = color(255, 10, 10, 0);
    }

    if(healthCounter == 0){
      this.sceneManager.showScene(gameOverScene);
    }
    else if (enemyHealthCounter == 0){
      this.sceneManager.showScene(youWinScene);
    }

  }

  console.log("Enter pressed: Game Begins");
}

function gameOverScene() {
  this.draw = function(){
    background(0, 0, 100);
    textSize(80);
    fill(255, 255, 255);
    text("You Lose", 340, 250);
    /*textSize(32);
    text("Press ENTER to return to the Main Menu", 190, 800);

    this.keyPressed = function(){
      if (keyCode == ENTER){
        this.sceneManager.showScene(startMenuScene, key);
      }
    }*/
  }
  console.log("Game Over scene: Game Ended");
}

function youWinScene() {
  this.draw = function(){
    background(0, 180, 0);
    textSize(80);
    fill(255, 255, 255);
    text("You Win!", 340, 250);
    /*textSize(32);
    text("Press ENTER to return to the Main Menu", 190, 800);

    this.keyPressed = function(){
      if (keyCode == ENTER){
        this.sceneManager.showScene(startMenuScene, key);
      }
    }*/

  }
  console.log("You Win scene: Game Ended succesfully");
}


class ChargeCrystal{
  constructor(){
    this.isBroken = false;
    this.crystalObject = new Rhombus();
    this.ccX = random(120, 650);
    this.ccY = random(120, 650);
    this.ccColor = color(10, 10, 255, 255);

    this.rad = 100; // Width of the shape
    this.xpos = this.ccX; 
    this.ypos = this.ccY; // Starting position of shape
    
    this.xspeed = random(1, 3); // Speed of the shape
    this.yspeed = random(1, 3); // Speed of the shape
    
    this.xdirection = 1; // Left or Right
    this.ydirection = 1; // Top to Bottom
  }

  show(){
    this.crystalObject.x = this.ccX;
    this.crystalObject.y = this.ccY;
    this.crystalObject.color = this.ccColor;
    this.crystalObject.show();
  }

  crystalMotion(){
    // Update the position of the shape
    this.xpos = this.xpos + this.xspeed * this.xdirection;
    this.ypos = this.ypos + this.yspeed * this.ydirection;

    // Test to see if the shape exceeds the boundaries of the screen
    // If it does, reverse its direction by multiplying by -1
    if (this.xpos > width - this.rad || this.xpos < this.rad) {
      this.xdirection *= -1;
    }
    if (this.ypos > height - this.rad || this.ypos < this.rad) {
      this.ydirection *= -1;
    }

    // Draw the shape
    this.ccX = this.xpos;
    this.ccY = this.ypos;
    fill(200, 200, 0, 0);
    ellipse(this.xpos, this.ypos, this.rad, this.rad);

  }
}


class Enemy{
  constructor(){
    this.enemyObject = new Polygon();
    this.eX = random(120, 650);
    this.eY = random(120, 650);
    this.eColor = color(255, 10, 10, 255);

    this.rad = 100; // Width of the shape
    this.xpos = this.eX; 
    this.ypos = this.eY; // Starting position of shape
    
    this.xspeed = random(1, 3); // Speed of the shape
    this.yspeed = random(1, 3); // Speed of the shape
    
    this.xdirection = 1; // Left or Right
    this.ydirection = 1; // Top to Bottom
  }

  show(){
    this.enemyObject.x = this.eX;
    this.enemyObject.y = this.eY;
    this.enemyObject.color = this.eColor;
    this.enemyObject.show();
  }

  enemyMotion(){
    // Update the position of the shape
    this.xpos = this.xpos + this.xspeed * this.xdirection;
    this.ypos = this.ypos + this.yspeed * this.ydirection;

    // Test to see if the shape exceeds the boundaries of the screen
    // If it does, reverse its direction by multiplying by -1
    if (this.xpos > width - this.rad || this.xpos < this.rad) {
      this.xdirection *= -1;
    }
    if (this.ypos > height - this.rad || this.ypos < this.rad) {
      this.ydirection *= -1;
    }

    // Draw the shape
    this.eX = this.xpos;
    this.eY = this.ypos;
    fill(0, 255, 0, 0);
    ellipse(this.xpos, this.ypos, this.rad, this.rad);

  }
}
