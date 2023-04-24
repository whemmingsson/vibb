class Connector extends ComponentBase {
  constructor(x, y, h, parentComponent, type) {
    super(true, true, false, false);
    this.x = x;
    this.y = y;
    this.color = new Color(20, 360, 60);
    this.w = Globals.ConnectorWidth;
    this.h = h;

    this.label = "Input " + this.id;
    this.parentComponent = parentComponent;
    this.type = type;
  }

  _applyBorder() {
    if (this.mouseIsOver()) {
      strokeWeight(2);
      stroke(100, 0, 100);
    } else {
      noStroke();
    }
  }

  render() {
    this.color.applyFill();
    this._applyBorder();
    if (this.type === "input") arc(this.x, this.y, this.w, this.h, PI / 2, PI / 2 + PI, PIE);
    else if (this.type === "output") arc(this.x, this.y, this.w, this.h, PI / 2 + PI, PI / 2 + PI + PI, PIE);
  }

  mouseIsOver() {
    if (this.type === "input") return dist(mouseX, mouseY, this.x, this.y) < this.w / 2 && mouseX < this.x;
    if (this.type === "output") return dist(mouseX, mouseY, this.x, this.y) < this.w / 2 && mouseX > this.x;
  }

  onClick() {
    this.parentComponent.removeInput(this);
  }
}
