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

  applyBackground() {
    background(this.h, this.s, this.b, this.a);
    return this;
  }
}

const SchemeDefault = {
  SignalOn: new Color(0, 0, 100),
  SignalOff: new Color(0, 0, 100),
  White: new Color(0, 0, 100),
  Black: new Color(0, 0, 0),
  ClickArea: new Color(205, 77, 45),
  Debug: new Color(250, 360, 100),
  GridLine: new Color(205, 77, 62),
  Gate: new Color(205, 77, 57, 0.9),
  Background: new Color(205, 77, 57),
  Transparent: new Color(0, 0, 0, 0),
};

const SchemeDark = {
  SignalOn: new Color(0, 90, 100),
  SignalOff: new Color(0, 0, 85),
  White: new Color(0, 0, 100),
  Black: new Color(0, 0, 0),
  ClickArea: new Color(0, 0, 10),
  Debug: new Color(250, 360, 100),
  GridLine: new Color(0, 0, 10),
  Gate: new Color(0, 0, 5, 0.9),
  Background: new Color(0, 0, 5),
  Transparent: new Color(0, 0, 0, 0),
};


// Global constants
const Globals = {
  PinSpacing: 2,
  StrokeWeight: 2,
  WireWeight: 1,
  ButtonDiameter: 60,
  AnchorDiameter: 10,
  GridLineWeight: 1,
};

// Options that can be changed by the user
const Settings = {
  SnapToGrid: true,
  ShowGrid: true,
  GridCellSize: 20,
  Theme: 'default',
}

const SchemeMap = {
  'default': SchemeDefault,
  'dark': SchemeDark,
}

const GetScheme = () => SchemeMap[Settings.Theme];

const MathUtils = {
  isPointOnLine: (p, p1, p2, threshold) => {
    if (!threshold) threshold = 1000;

    const dxc = p.x - p1.x;
    const dyc = p.y - p1.y;
    const dxl = p2.x - p1.x;
    const dyl = p2.y - p1.y;
    const cross = dxc * dyl - dyc * dxl;

    if (Math.abs(cross) > threshold) return false;

    if (Math.abs(dxl) >= Math.abs(dyl)) return dxl > 0 ? p1.x <= p.x && p.x <= p2.x : p2.x <= p.x && p.x <= p1.x;
    else return dyl > 0 ? p1.y <= p.y && p.y <= p2.y : p2.y <= p.y && p.y <= p1.y;
  },

  getSnapToGridPoint: (x, y, gcs) => { return { x: Math.round(x / gcs) * gcs, y: Math.round(y / gcs) * gcs } },
}

const BrowserUtils = {
  getDistanceFromScreenEdges: (canvasX, canvasY) => {
    // Get the bounding rectangle of the canvas
    const canvasRect = document.getElementById("sketch-holder").getBoundingClientRect();

    // Calculate the distance to the left edge of the screen
    const distanceToLeftEdge = canvasRect.left + canvasX;

    // Calculate the distance to the top edge of the screen
    const distanceToTopEdge = canvasRect.top + canvasY;

    return {
      x: distanceToLeftEdge,
      y: distanceToTopEdge
    };
  }
}