class IO {
  constructor() { }

  _loadRaw(sketchName) {
    if (this._hasSavedState(sketchName ?? "state")) {
      return localStorage.getItem(sketchName ?? "state");
    }
  }

  _loadGates(stateObj) {
    stateObj.gates.forEach((g) => {
      const gate = new Gate(g.x, g.y, g.w, g.h, getGateByName(g.gate.label), true);
      gate.id = g.id;
      state.register(gate);
    });
  }

  _loadPins(stateObj) {
    stateObj.gates.forEach((g) => {
      const gate = state.findByID(g.id);
      g.inputs.forEach((p) => {
        const pin = gate.addInput();
        pin.id = p.id;
        state.register(pin);
      });

      g.outputs.forEach((p) => {
        const pin = gate.addOutput();
        pin.id = p.id;
        state.register(pin);
      });
    });
  }

  _loadButtons(stateObj) {
    stateObj.buttons.forEach((b) => {
      const button = new Button(b.x, b.y, b.w, b.h, b.label);
      button.id = b.id;
      state.register(button);
    });
  }

  _loadOutputs(stateObj) {
    stateObj.outputs.forEach((o) => {
      const output = new Output(o.x, o.y, o.w, o.h);
      output.id = o.id;
      state.register(output);
    });
  }

  _loadWires(stateObj) {
    stateObj.wires.forEach((w) => {
      const from = state.findByID(w.from);
      const to = state.findByID(w.to);
      const wire = new Wire(from, to);
      wire.id = w.id;
      wire.anchors = w.anchors;
      from.outWires.push(wire);
      to.inWires.push(wire);
      state.register(wire);
    });
  }

  _hasSavedState(name) {
    return localStorage.getItem(name) !== null;
  }

  getSavedSketchesNames() {
    return Object.keys(localStorage).filter((k) => k !== "state");
  }

  save(sketchName) {
    const stateJson = state.toJson();
    console.log("Saving...", stateJson, sketchName);
    localStorage.setItem(sketchName ?? "state", stateJson);
  }

  load(sketchName) {
    // TODO: Find a better way to do this - like a "dirty" flag on the state
    if (state.hasState() && !confirm("Are you sure you want to load? This will clear the current sketch.")) return;

    const stateJson = this._loadRaw(sketchName);
    console.log("Loading...", stateJson);
    const stateObj = JSON.parse(stateJson);

    if (!stateObj) {
      console.log("Nothing to load");
      return;
    }

    if (!stateObj.gates || stateObj.gates.length === 0) {
      console.log("No gates to load");
      return;
    }

    state.clear();

    this._loadGates(stateObj);
    this._loadPins(stateObj);
    this._loadButtons(stateObj);
    this._loadOutputs(stateObj);
    this._loadWires(stateObj);
  }
}
