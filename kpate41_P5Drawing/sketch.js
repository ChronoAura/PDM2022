let pg1, pg2, pg3, pg4;

function setup() {
  createCanvas(800, 2400);
  pg1 = createGraphics(800, 400);
  pg2 = createGraphics(800, 800);
  pg3 = createGraphics(800, 400);
  pg4 = createGraphics(800, 800);
}

function draw() {
  pg1.background(118, 242, 58);     //Example #1
  image(pg1, 0, 0);
  stroke(0);
  strokeWeight(3);
  fill(255);
  circle(200, 200, 350);
  square(425, 30, 350);

  pg2.background(255);              //Example #2
  image(pg2, 0, 400, 800, 800);
  
  fill(color(255, 0, 0, 80));             //Red circle parameters
  noStroke();
  circle(400, 700, 350);
  
  fill(color(0, 0, 255, 80));             //Blue circle parameters
  noStroke();
  circle(300, 900, 350);
  
  fill(color(0, 255, 0, 80));             //Green circle parameters
  noStroke();
  circle(500, 900, 350);
  
  pg3.background(0);                //Example #3
  image(pg3, 0, 1200);

  fill(255, 247, 74, 250);              //Yellow arc (PacMan) parameters
  noStroke();
  arc(200, 1400, 350, 350, 5 * PI / 4, 3 * PI / 4);

  fill(255, 0, 0, 230);                 //Red shape (red ghost) parameters
  noStroke();
  fill(255, 0, 0, 230);
  beginShape();
  arc(600, 1370, 300, 285, PI, 0, OPEN);  //Curve top of custom, red shape
  vertex(450, 1370);                      //Top left vertex blending with curve
  vertex(450, 1570);                      //Bottom left vertex
  vertex(750, 1570);                      //Bottom right vertex
  vertex(750, 1370);                      //Top right vertex blending with curve
  endShape(CLOSE);

  stroke(255);
  strokeWeight(15);
  fill(0, 0, 255, 230);
  circle(525, 1370, 70);
  circle(675, 1370, 70);

  pg4.colorMode(HSB);               //Example #4
  pg4.background(230, 255, 50);
  image(pg4, 0, 1600);

  stroke(255);                            //Green circle parameters
  strokeWeight(5);
  fill(0, 125, 0, 230);
  circle(400, 2000, 400);

  fill(255, 0, 0, 230);                   //Red star shape parameters
  beginShape();                           //Vertex list starts from the top point of the star, going clockwise.
  vertex(400, 1800);
  vertex(450, 1950);
  vertex(595, 1950);
  vertex(475, 2025);
  vertex(520, 2165);
  vertex(400, 2100);
  vertex(280, 2165);
  vertex(325, 2025);
  vertex(205, 1950);
  vertex(350, 1950);
  endShape(CLOSE);
}