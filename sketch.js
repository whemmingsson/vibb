const board = new Breadboard();
const io = new IO();

let saveButton;
let loadButton;
let clearButton;

function setup() {
  const canvas = createCanvas(1380, 700);
  canvas.parent("sketch-holder");

  board.onSetup();

  disableRightClickMenu();

  // TODO: Create a menu class
  saveButton = createMenuButton("Save", () => io.save());
  loadButton = createMenuButton("Load", () => io.load());
  clearButton = createMenuButton("Clear", () => state.clear());
}

function createMenuButton(text, onClick) {
  const button = createButton(text);
  button.parent("menu");
  button.mousePressed(onClick);
  return button;
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
