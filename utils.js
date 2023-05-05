class Color {
  constructor(h, s, b, a) {
    this.h = h;
    this.s = s;
    this.b = b;
    this.a = a;
  }

  applyFill() {
    fill(this.h, this.s, this.b, this.a);
    return this;
  }

  applyStroke() {
    stroke(this.h, this.s, this.b, this.a);
    return this;
  }
}

const ColorScheme = {
  SignalOn: new Color(80, 360, 95),
  SignalOff: new Color(0, 360, 75),
  White: new Color(0, 0, 100),
  Black: new Color(0, 0, 0),
  ClickArea: new Color(0, 0, 50),
  Debug: new Color(250, 360, 100),
};

const Globals = {
  PinSpacing: 2,
  StrokeWeight: 1,
  WireWeight: 3,
  ButtonDiameter: 50,
  AnchorDiameter: 10,
};

function isPointOnLine(p, p1, p2, threshold) {
  if (!threshold) threshold = 1000;

  const dxc = p.x - p1.x;
  const dyc = p.y - p1.y;
  const dxl = p2.x - p1.x;
  const dyl = p2.y - p1.y;
  const cross = dxc * dyl - dyc * dxl;

  if (Math.abs(cross) > threshold) return false;

  if (Math.abs(dxl) >= Math.abs(dyl)) return dxl > 0 ? p1.x <= p.x && p.x <= p2.x : p2.x <= p.x && p.x <= p1.x;
  else return dyl > 0 ? p1.y <= p.y && p.y <= p2.y : p2.y <= p.y && p.y <= p1.y;
}
