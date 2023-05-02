const board = new Breadboard();

function setup() {
  createCanvas(1360, 800);
  board.onSetup();

  // DISABLE RIGHT CLICK CONTEXT MENU
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
