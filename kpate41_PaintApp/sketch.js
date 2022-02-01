let cPalette;
let clearCanvasButton;
let chosenColor = 'black';                  //Defualt color for within PaintBrush function

function setup() {
  createCanvas(1800, 1000);
  cPalette = createGraphics(50, 1000);

  clearCanvasButton = createButton('clear canvas');
  clearCanvasButton.size(50, 40);
  clearCanvasButton.position(0, 550);
  clearCanvasButton.mousePressed(clear);
}

function draw() {

  ColorPalette();
  PaintBrush();

}

function ColorPalette()                     //Visual of the color palette on the left side of the screen
{
  cPalette.noStroke();
  cPalette.fill('red');                     //Red
  cPalette.square(0, 0, 50);

  cPalette.fill('orange');                  //Orange
  cPalette.square(0, 50, 50);

  cPalette.fill('yellow');                  //Yellow
  cPalette.square(0, 100, 50);

  cPalette.fill(0, 255, 0);                 //Green
  cPalette.square(0, 150, 50);

  cPalette.fill('cyan');                    //Light Blue
  cPalette.square(0, 200, 50);

  cPalette.fill('blue');                    //Blue
  cPalette.square(0, 250, 50);

  cPalette.fill('magenta');                 //Magenta
  cPalette.square(0, 300, 50);

  cPalette.fill(127, 63, 0);                //Brown
  cPalette.square(0, 350, 50);

  cPalette.fill('white');                   //White
  cPalette.square(0, 400, 50);

  cPalette.fill('black');                   //Black
  cPalette.square(0, 450, 50);

  cPalette.background(255, 255, 255, 0);
  image(cPalette, 0, 0);
}

function PaintBrush() 
{
  fill(chosenColor);                        //This segment paints with chosen color
  noStroke();
  if (mouseIsPressed) {
    circle(mouseX, mouseY, 20);
  }

  if (mouseIsPressed)                       //Nested If statements to narrow down color selection through X & Y coordinates
  {
    if (mouseX <= 50)
    {
      if (mouseY <= 50)
      {
        chosenColor = 'red';
      }
      else if(mouseY <= 100) 
      {
        chosenColor = 'orange';
      }
      else if(mouseY <= 150) 
      {
        chosenColor = 'yellow';
      }
      else if(mouseY <= 200) 
      {
        chosenColor = color(0, 255, 0);
      }
      else if(mouseY <= 250) 
      {
        chosenColor = 'cyan';
      }
      else if(mouseY <= 300) 
      {
        chosenColor = 'blue';
      }
      else if(mouseY <= 350) 
      {
        chosenColor = 'magenta';
      }
      else if(mouseY <= 400) 
      {
        chosenColor = color(127, 63, 0);
      }
      else if(mouseY <= 450) 
      {
        chosenColor = 'white';
      }
      else if(mouseY <= 500) 
      {
        chosenColor = 'black';
      }
      else
      {
        return;
      }
    }
  }

}
