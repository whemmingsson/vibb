let board;
let menu;

function setup() {
  const canvas = createCanvas(1380, 700);
  canvas.parent("sketch-holder");

  menu = new Menu();
  board = new Breadboard();

  disableRightClickMenu();
}

function disableRightClickMenu() {
  for (let element of document.getElementsByClassName("p5Canvas")) {
    element.addEventListener("contextmenu", (e) => e.preventDefault());
  }
}

function draw() {
  board.onDraw();
}
function mousePressed() {
  board.onMousePressed();
}
function mouseDragged() {
  board.onMouseDragged();
}
function mouseReleased() {
  board.onMouseReleased();
}
function keyTyped() {
  board.onKeyTyped();
}
