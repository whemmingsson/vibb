class Gate extends ComponentBase {
  constructor(x, y, w, h, gate, loadingFromJson = false) {
    super(true, true, true, true);
    this.x = x;
    this.y = y;
    this.w = w ? w : 100;
    this.h = h ? h : 100;
    this.inputs = [];
    this.outputs = [];
    this.gate = gate;
    this.type = "template";

    // Register the pins only if we are not loading from json
    // TODO: This is a bit hacky, but it works for now
    if (!loadingFromJson) {
      for (let i = 0; i < gate.inputs; i++) {
        state.register(this.addInput());
      }
      for (let i = 0; i < gate.outputs; i++) {
        state.register(this.addOutput());
      }
    }

    if (loadingFromJson) {
      this.type = "gate";
    }
  }

  _applyBorder() {
    strokeWeight(Globals.StrokeWeight);
    if (this.mouseIsOver()) {
      GetScheme().White.applyStroke();
    } else {
      GetScheme().White.applyStroke();
    }
  }

  _positionAndScalePins(pins) {
    const height = this.h / (pins.length + 1);

    pins.forEach((pin, idx) => {
      const y = this.y + height * (idx + 1);
      pin.x = pin.type === "input" ? this.x - Globals.StrokeWeight / 2 : this.x + this.w + Globals.StrokeWeight / 2;
      pin.y = y;
      pin.h = height - Globals.PinSpacing;
      pin.w = height - Globals.PinSpacing;
    });
  }

  addInput() {
    const input = new Pin(this.x, 0, this, "input");
    this.inputs.push(input);
    this._positionAndScalePins(this.inputs);
    return input;
  }

  addOutput() {
    const output = new Pin(this.x + this.w, 0, this, "output");
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
    GetScheme().Gate.applyFill();
    this._applyBorder();
    rect(this.x, this.y, this.w, this.h, this.h * 0.1);
  }

  _renderLabel() {
    if (this.gate && this.gate.label) {
      noStroke();
      GetScheme().White.applyFill();
      textAlign(CENTER, CENTER);
      textSize(this.h * 0.5);
      text(this.gate.label.toUpperCase(), this.x + this.w / 2, this.y + this.h / 2 + this.h * 0.05);

      // Render ID for debugging
      //textSize(this.h * 0.2);
      //text(this.id, this.x + this.w / 2, this.y + this.h / 2 + this.h * 0.3);
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
    // Logic of the gate itself
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
    if (this instanceof GateTemplate) {
      return; // Don't delete templates
    }

    [...this.inputs, ...this.outputs].forEach((c) => {
      c.delete();
      state.unregister(c);
    });

    this.inputs = [];
    this.outputs = [];
  }

  clone() {
    const clone = new Gate(this.x, this.y + this.h + 20, this.w, this.h, this.gate);
    clone.type = "gate";
    state.register(clone);
  }

  reduce() {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      w: this.w,
      h: this.h,
      gate: this.gate,
      inputs: this.inputs.map((i) => i.reduce()),
      outputs: this.outputs.map((o) => o.reduce())
    };
  }
}

class GateTemplate extends Gate {
  constructor(x, y, w, h, gate, loadingFromJson = false) {
    super(x, y, w, h, gate, loadingFromJson);
    this.type = "template";
  }

  delete() {
    return; // Don't delete templates
  }
}
