//Kirtesh Patel - CSC 2463 Final Project: "A Shot in the Dark"

//Serial port global variables
let serialPDM;
let portName = 'COM5';
let lightSensor;
let chargeLevel;

//Gameplay global variables
let healthCounter;
let enemyHealthCounter;
let previousAttackTime;
let playerDist;
let enemy1;

let isPlaying = false;
let chargeL0Sound = new Tone.PolySynth();
let chargeL1Sound = new Tone.PolySynth();
let chargeL2Sound = new Tone.PolySynth();
let chargeL3Sound = new Tone.PolySynth();

//Sets up Serial port and scenemanger.js
function setup() {
  serialPDM = new PDMSerial(portName);
  console.log(serialPDM.inData);
  lightSensor = serialPDM.sensorData;

  createCanvas(1000, 1000);

  var mgr = new SceneManager();
  mgr.wire();
  mgr.showScene(startMenuScene);

  frameRate(50);

  chargeL0Sound.toDestination();
  chargeL1Sound.toDestination();
  chargeL2Sound.toDestination();
  chargeL3Sound.toDestination();

}

//This entire function encapsulates the Start Menu scene

function startMenuScene() {
  this.draw = function(){
    background(100, 0, 0);
    noStroke();
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
      reset();
      this.sceneManager.showScene(gameLoopScene, key);
    }
  }
}

//This function encapsulates the main game loop scene & uses external custom classes below it

function gameLoopScene() {

  //Populate scene with player, crystals, & enemy models
  let player = new Circle();
  player.size = 30;
  player.color = "whitesmoke";

  let crystal1 = new ChargeCrystal();
  let crystal2 = new ChargeCrystal();
  let crystal3 = new ChargeCrystal();
  enemy1 = new Enemy();

  this.draw = function(){
    background(0, 0, 0);
    healthUI();

    //Spawn all models
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
    
    //3 if-statments below: checks for enemy attack (collission with a crystal)
    let enemyDist = dist(crystal1.ccX, crystal1.ccY, enemy1.eX, enemy1.eY);
    if(enemyDist < 50 && crystal1.isBroken == false){
      crystal1.isBroken = true;
      healthCounter -= 1;
    }

    let enemyDist2 = dist(crystal2.ccX, crystal2.ccY, enemy1.eX, enemy1.eY);
    if(enemyDist2 < 50 && crystal2.isBroken == false){
      crystal2.isBroken = true;
      healthCounter -= 1;
    }

    let enemyDist3 = dist(crystal3.ccX, crystal3.ccY, enemy1.eX, enemy1.eY);
    if(enemyDist3 < 50 && crystal3.isBroken == false){
      crystal3.isBroken = true;
      healthCounter -= 1;
    }

    //Checks for game win & lose conditions
    if(healthCounter == 0){
      this.sceneManager.showScene(gameOverScene);
      crystal1.isBroken = false;
      crystal2.isBroken = false;
      crystal3.isBroken = false;
    }
    else if (enemyHealthCounter == 0){
      this.sceneManager.showScene(youWinScene);
      crystal1.isBroken = false;
      crystal2.isBroken = false;
      crystal3.isBroken = false;
    }

    /*Checks for player overlap with enemy & reveals enemy.
      Then attack within the reticle range.*/
    playerDist = dist(enemy1.eX, enemy1.eY, player.x, player.y);
    if(playerDist <= 110 && chargeLevel == 3){
      enemy1.eColor = color(255, 10, 10, 255);
      playerAttack();
    }else if(playerDist <= 80 && chargeLevel == 2){
      enemy1.eColor = color(255, 10, 10, 255);
      playerAttack();
    }else if(playerDist < 60 && chargeLevel == 1){
      enemy1.eColor = color(255, 10, 10, 255);
      playerAttack();
    }else {
      enemy1.eColor = color(255, 10, 10, 0);
    }

    /*Checks Light Sensor value within certain ranges.
      Changes player size, repsective to level increase.
      Sends back chargeLevel value to Arduino board to light up respective LEDs.*/
    if(lightSensor.a0 < 40){
      chargeLevel = 0;
      player.size = 30;
      serialPDM.transmit('chargeLevel', chargeLevel);
    }else if(lightSensor.a0 >= 40 && lightSensor.a0 < 140){
      chargeLevel = 1;
      player.size = 40;
      serialPDM.transmit('chargeLevel', chargeLevel);
    }else if(lightSensor.a0 >= 140 && lightSensor.a0 < 180){
      chargeLevel = 2;
      player.size = 60;
      serialPDM.transmit('chargeLevel', chargeLevel);
    }else{
      chargeLevel = 3;
      player.size = 90;
      serialPDM.transmit('chargeLevel', chargeLevel);
    }
    chargeAudio();

    showReticle();

  }

  console.log("Enter pressed: Game Begins");
  console.log(lightSensor.a0);
}

//The 2 functions below, respectively create a version of the End Game screen

function gameOverScene() {
  this.draw = function(){
    background(0, 0, 100);
    noStroke();
    textSize(80);
    fill(255, 255, 255);
    text("You Lose", 340, 250);
    textSize(32);
    text("Press ENTER to return to the Main Menu", 190, 800);

    this.keyPressed = function(){
      if (keyCode == ENTER){
        this.sceneManager.showScene(startMenuScene, key);
      }
    }
  }
  console.log("Game Over scene: Game Ended");
}

function youWinScene() {
  this.draw = function(){
    background(0, 180, 0);
    noStroke();
    textSize(80);
    fill(255, 255, 255);
    text("You Win!", 340, 250);
    textSize(32);
    text("Press ENTER to return to the Main Menu", 190, 800);

    this.keyPressed = function(){
      if (keyCode == ENTER){
        this.sceneManager.showScene(startMenuScene, key);
      }
    }

  }
  console.log("You Win scene: Game Ended succesfully");
}

//The 4 functions below are created to reduce the overcrowded code within the function, gameLoopScene()

function reset() {
  healthCounter = 3;
  enemyHealthCounter = 3;
  previousAttackTime = -3000;
  chargeLevel = 0;
}

function healthUI() {
  noStroke();
  textSize(32);
  fill(0, 220, 200);
  text("Health Remaining: " + healthCounter, 640, 970);
  fill(220, 0, 0);
  text("Enemy Health Remaining: " + enemyHealthCounter, 30, 970);
}

function showReticle() {
  if(millis() - previousAttackTime > 3000){
    stroke(0, 255, 10, 220);
  }else{
    stroke(250, 10, 10, 220);
  }
  strokeWeight(3);
  noFill();
  circle(mouseX, mouseY, 30);
}

function playerAttack() {
  if(playerDist < 50){
    if(playerDist < 30 && millis() - previousAttackTime > 3000){
      previousAttackTime = millis();
      enemy1.xpos = random(350, 650);
      enemy1.ypos = random(350, 650);
      enemyHealthCounter -= 1;
    }
  }
}

function chargeAudio(){
  if (chargeLevel == 0 && chargeL0Sound.isPlaying == false){
    chargeL0Sound.set({detune: -1200});
    chargeL0Sound.triggerAttackRelease(['C2'], 1);
    chargeL0Sound.isPlaying = true;
    chargeL1Sound.isPlaying = false;
    chargeL2Sound.isPlaying = false;
    chargeL3Sound.isPlaying = false;
  }else if(chargeLevel == 1 && chargeL1Sound.isPlaying == false){
    chargeL1Sound.set({detune: -1200});
    chargeL1Sound.triggerAttackRelease(['C3'], 1);
    chargeL0Sound.isPlaying = false;
    chargeL1Sound.isPlaying = true;
    chargeL2Sound.isPlaying = false;
    chargeL3Sound.isPlaying = false;
  }else if(chargeLevel == 2 && chargeL2Sound.isPlaying == false){
    chargeL2Sound.set({detune: -1200});
    chargeL2Sound.triggerAttackRelease(['C4'], 1);
    chargeL0Sound.isPlaying = false;
    chargeL1Sound.isPlaying = false;
    chargeL2Sound.isPlaying = true;
    chargeL3Sound.isPlaying = false;
  }else if(chargeLevel == 3 && chargeL3Sound.isPlaying == false){
    chargeL3Sound.set({detune: -1200});
    chargeL3Sound.triggerAttackRelease(['C5'], 1);
    chargeL0Sound.isPlaying = false;
    chargeL1Sound.isPlaying = false;
    chargeL2Sound.isPlaying = false;
    chargeL3Sound.isPlaying = true;
  }
}

/*The class below populates the instant creation & movement of each crystal.
  The same is done for the Enemy class below this class.*/
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
    if(this.isBroken == false){
      this.ccColor = color(10, 10, 255, 255);
    }else{
      this.ccColor = color(10, 10, 255, 50);
    }

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
    this.eX = 500;
    this.eY = 500;
    this.eColor = color(255, 10, 10, 0);

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
