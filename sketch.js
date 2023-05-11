const board = new Breadboard();

let saveButton;
let loadButton;

function setup() {
  const canvas = createCanvas(1380, 800);
  canvas.parent("sketch-holder");
  smooth();
  board.onSetup();

  // DISABLE RIGHT CLICK CONTEXT MENU
  for (let element of document.getElementsByClassName("p5Canvas")) {
    element.addEventListener("contextmenu", (e) => e.preventDefault());
  }

  // CREATE BUTTONS

  // TODO: Create a menu class
  saveButton = createButton("Save");
  saveButton.parent("menu");
  saveButton.mousePressed(() => {
    const stateJson = state.toJson();
    const stateJson64 = btoa(stateJson);
    console.log("Saving...", stateJson64);
    localStorage.setItem('state', stateJson64);
  });

  loadButton = createButton("Load");
  loadButton.parent("menu");
  loadButton.mousePressed(() => {
    console.log("Loading...");
    let state64 = localStorage.getItem('state');
    console.log(atob(state64));
  });

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
