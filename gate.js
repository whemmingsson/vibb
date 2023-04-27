class Gate extends ComponentBase {
  constructor(x, y, w, h, gate) {
    super(true, true, true, true);
    this.x = x;
    this.y = y;
    this.color = new Color(50, 360, 100);
    this.w = w ? w : 100;
    this.h = h ? h : 100;
    this.inputs = [];
    this.outputs = [];
    this.gate = gate;

    for (let i = 0; i < gate.inputs; i++) {
      state.register(this.addInput());
    }
    for (let i = 0; i < gate.outputs; i++) {
      state.register(this.addOutput());
    }
  }

  _applyBorder() {
    if (this.mouseIsOver(false)) {
      strokeWeight(2);
      stroke(100, 0, 100);
    } else {
      noStroke();
    }
  }

  _positionAndScalePins(pins) {
    const availablePinHeight = Math.min(this.h / pins.length, 50);

    pins.forEach((pin, idx) => {
      pin.x = pin.type === "input" ? this.x : this.x + this.w;
      pin.y = this.y + idx * availablePinHeight + availablePinHeight / 2;
      pin.h = availablePinHeight - Globals.PinSpacing * 2;
      pin.w = availablePinHeight - Globals.PinSpacing * 2;
    });
  }

  addInput() {
    const input = new Pin(this.x, 0, 0, this, "input");
    this.inputs.push(input);
    this._positionAndScalePins(this.inputs);
    return input;
  }

  addOutput() {
    const output = new Pin(this.x + this.w, 0, 0, this, "output");
    this.outputs.push(output);
    this._positionAndScalePins(this.outputs);
    return output;
  }

  removeInput(pin) {
    const idx = this.inputs.findIndex((p) => p.id === pin.id);
    if (idx < 0) return;

    this.inputs.splice(idx, 1);
    this._positionAndScalePins(this.inputs);
    state.unregister(pin);
  }

  removeOutput(pin) {
    const idx = this.outputs.findIndex((p) => p.id === pin.id);
    if (idx < 0) return;

    this.outputs.splice(idx, 1);
    this._positionAndScalePins(this.outputs);
    state.unregister(pin);
  }

  _renderRect() {
    this.color.applyFill();
    this._applyBorder();
    rect(this.x, this.y, this.w, this.h);
  }

  _renderLabel() {
    if (this.gate && this.gate.label) {
      noStroke();
      fill(0);
      textAlign(CENTER);
      textSize(this.h * 0.3);
      text(this.gate.label, this.x + this.w / 2, this.y + this.h / 2 + (this.h * 0.3) / 2.5);

      // Render ID for debugging
      textSize(this.h * 0.2);
      text(this.id, this.x + this.w / 2, this.y + this.h / 2 + (this.h * 0.3));
    }
  }

  render() {
    this._renderRect();
    this._renderLabel();

    this.inputs.forEach((input) => input.render());
    this.outputs.forEach((output) => output.render());
  }

  updatePosition(x, y) {
    this.x = x;
    this.y = y;
    this._positionAndScalePins(this.outputs);
    this._positionAndScalePins(this.inputs);
  }

  _inputLogic() {
    // Apply signal if input has any wires going into it
    this.inputs.forEach((i) => {
      i.applyInputSignal();
    });
  }

  _outputLogic() {
    // Logic of the gate it self
    const outputSignal = this.gate.logic(this.inputs.map((i) => i.on));
    this.outputs.forEach((o) => {
      o.toggle(outputSignal);
    });
  }

  logic() {
    this._inputLogic();
    this._outputLogic();
  }

  mouseIsOver() {
    const mX = mouseX;
    const mY = mouseY;
    return mX > this.x && mX < this.x + this.w && mY > this.y && mY < this.y + this.h;
  }

  onClick(button) {
    if (button === RIGHT) {
      return this.clone();
    }
  }

  onKeyTyped(key) {
    if (key === "i") state.register(this.addInput());
    else if (key === "o") state.register(this.addOutput());
  }

  delete() {
    [...this.inputs, ...this.outputs].forEach((c) => {
      console.log("Deleting pin with id")
      c.delete();
      state.unregister(c);
    });

    this.inputs = [];
    this.outputs = [];
  }

  clone() {
    const clone = new Gate(this.x, this.y + this.h + 20, this.w, this.h, this.gate);
    state.register(clone);
  }
}
