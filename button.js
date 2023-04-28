class Button extends ComponentBase {
  constructor(x, y, w, h) {
    super(true, true, true, true);
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.on = false;
    this.outWires = [];
  }

  render() {
    if (this.on) {
      SignalOn.applyFill();
    } else {
      SignalOff.applyFill();
    }

    ellipse(this.x, this.y, this.w, this.h);
  }
}
