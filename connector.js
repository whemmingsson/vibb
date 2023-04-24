class Connector extends ComponentBase {
  constructor(x, y, h, parentComponent, type) {
    super(true, true, false, false);
    this.x = x;
    this.y = y;
    this.offColor = new Color(0, 360, 75);
    this.onColor = new Color(80, 360, 95);
    this.w = Globals.ConnectorWidth;
    this.h = h;

    this.label = "Input " + this.id;
    this.parentComponent = parentComponent;
    this.type = type;
    this.on = false; // Only applies to inputs?
  }

  _applyBorder() {
    if (this.mouseIsOver()) {
      strokeWeight(2);
      stroke(100, 0, 100);
    } else {
      noStroke();
    }
  }

  _applyFill() {
    if (this.on) this.onColor.applyFill();
    else this.offColor.applyFill();
  }

  render() {
    this._applyFill();
    this._applyBorder();
    if (this.type === "input") arc(this.x, this.y, this.w, this.h, PI / 2, PI / 2 + PI, PIE);
    else if (this.type === "output") arc(this.x, this.y, this.w, this.h, PI / 2 + PI, PI / 2 + PI + PI, PIE);
  }

  mouseIsOver() {
    if (this.type === "input") return dist(mouseX, mouseY, this.x, this.y) < this.w / 2 && mouseX < this.x;
    if (this.type === "output") return dist(mouseX, mouseY, this.x, this.y) < this.w / 2 && mouseX > this.x;
  }

  onClick(mouseButton) {
    if (mouseButton === RIGHT) {
      if (this.type === "input") this.parentComponent.removeInput(this);
      else if (this.type === "output") this.parentComponent.removeOutput(this);
    } else if (mouseButton === LEFT && this.type === "input") {
      this.on = !this.on;
    }
  }
}
