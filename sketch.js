let width, height;

const component = new Component(200, 200, 300, 200);
const component2 = new Component(550, 550);

const components = [component, component2];

function registerComponents() {
  components.forEach((c) => state.register(c));
  state.register(component.addInput());
}

function setup() {
  // RENDERING
  width = 1000;
  height = 800;
  colorMode(HSB);
  noStroke();

  for (let element of document.getElementsByClassName("p5Canvas")) {
    element.addEventListener("contextmenu", (e) => e.preventDefault());
  }

  // LOGIC
  registerComponents(); // Make the top-level components available for custom logic

  // CREATE CANVAS
  createCanvas(width + 1, height + 1);
}

function renderComponents() {
  components.forEach((c) => c.render()); // Will also render connectors
}

function applyCursor() {
  if (state.objects.some((c) => c.mouseIsOver(true))) {
    cursor(HAND);
  } else {
    cursor(ARROW);
  }
}

function draw() {
  background(25);
  renderComponents();
  applyCursor();
}

function mousePressed() {
  state.objects.forEach((c) => {
    if (c.mouseIsOver() && c.isClickable) {
      c.onClick(mouseButton);
    }
  });
}
