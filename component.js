class Component extends ComponentBase {
  constructor(x, y, w, h) {
    super(true, true, true, true);
    this.x = x;
    this.y = y;
    this.color = new Color(50, 360, 100);
    this.w = w ? w : 100;
    this.h = h ? h : 100;

    // Inputs and outputs are connectors
    this.inputs = [];
    this.outputs = [];
  }

  _applyBorder() {
    if (this.mouseIsOver(false)) {
      strokeWeight(2);
      stroke(100, 0, 100);
    } else {
      noStroke();
    }
  }

  _positionAndScaleConnectors(connectors) {
    const availableConnectorHeight = Math.min(this.h / connectors.length, 75);

    connectors.forEach((connector, idx) => {
      connector.y = this.y + idx * availableConnectorHeight + availableConnectorHeight / 2;
      connector.h = availableConnectorHeight - Globals.ConnectorSpacing * 2;
      connector.w = availableConnectorHeight - Globals.ConnectorSpacing * 2;
    });
  }

  addInput() {
    const input = new Connector(this.x, 0, 0, this, "input");
    this.inputs.push(input);
    this._positionAndScaleConnectors(this.inputs);
    return input;
  }

  addOutput() {
    const output = new Connector(this.x + this.w, 0, 0, this, "output");
    this.outputs.push(output);
    this._positionAndScaleConnectors(this.outputs);
    return output;
  }

  removeInput(connector) {
    const idx = this.inputs.findIndex((c) => c.id === connector.id);
    if (idx < 0) return;

    this.inputs.splice(idx, 1);
    this._positionAndScaleConnectors(this.inputs);
    state.unregister(connector);
  }

  removeOutput(connector) {
    const idx = this.outputs.findIndex((c) => c.id === connector.id);
    if (idx < 0) return;

    this.outputs.splice(idx, 1);
    this._positionAndScaleConnectors(this.outputs);
    state.unregister(connector);
  }

  render() {
    this.color.applyFill();
    this._applyBorder();

    rect(this.x, this.y, this.w, this.h);

    this.inputs.forEach((input) => input.render());
    this.outputs.forEach((output) => output.render());
  }

  mouseIsOver() {
    const mX = mouseX;
    const mY = mouseY;
    return mX > this.x && mX < this.x + this.w && mY > this.y && mY < this.y + this.h;
  }

  onClick(button) {
    console.log(button);
    if (button === LEFT) state.register(this.addInput());
    else if (button === RIGHT) state.register(this.addOutput());
  }
}
