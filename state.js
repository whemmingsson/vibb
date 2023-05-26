class State {
  constructor() {
    this.gates = [];
    this.pins = [];
    this.wires = [];
    this.buttons = [];
    this.areas = [];
    this.labels = [];
    this.objectCounter = 0;
  }

  register(object, loadingFromJson = false) {
    if (object instanceof Gate) {
      this.gates.push(object);
    }
    if (object instanceof Pin) {
      this.pins.push(object);
    }
    if (object instanceof Wire) {
      this.wires.push(object);
    }
    if (object instanceof Button) {
      this.buttons.push(object);
    }
    if (object instanceof ClickArea) {
      this.areas.push(object);
    }
    if (object instanceof Label) {
      object.zIndexClick = 100; // Labels should be clicked first
      this.labels.push(object);
    }

    this.objectCounter++;
    if (!loadingFromJson) {
      object.id = this.objectCounter;
    }
    return object;
  }

  _maybeUnregister(list, object, listName) {
    const idx = this._idx(list, object);
    if (idx >= 0) {
      list.splice(idx, 1);
      console.log("Unregistering", object.constructor.name, "with id", object.id, "from list", listName);
    }
  }

  _idx(list, object) {
    return list.indexOf(list.find((o) => o.id === object.id));
  }

  unregister(object) {
    if (!object.id) return;

    if (object instanceof Gate) {
      this._maybeUnregister(this.gates, object, "gates");
    }
    if (object instanceof Pin) {
      this._maybeUnregister(this.pins, object, "pins");
    }
    if (object instanceof Wire) {
      this._maybeUnregister(this.wires, object, "wires");
    }
    if (object instanceof Button) {
      this._maybeUnregister(this.buttons, object, "buttons");
    }
    if (object instanceof ClickArea) {
      this._maybeUnregister(this.areas, object, "area");
    }
    if (object instanceof Label) {
      this._maybeUnregister(this.labels, object, "labels");
    }
  }

  all() {
    return [...this.gates, ...this.pins, ...this.wires, ...this.buttons, ...this.areas, ...this.labels].sort((a, b) => b.zIndexClick - a.zIndexClick);
  }

  toJson() {
    return JSON.stringify(
      {
        gates: this.gates.map((g) => g.reduce()),
        wires: this.wires.map((w) => w.reduce()),
        buttons: this.buttons.map((b) => b.reduce()),
      },
      null,
      2
    );
  }

  clear() {
    this.gates = [];
    this.pins = [];
    this.wires = [];
    this.buttons = [];
    //this.areas = []; // Don't clear areas, they are used for input and output of the circuit
    this.labels = [];
    this.objectCounter = 0;
  }

  hasState() {
    return this.gates.length > 0 || this.pins.length > 0 || this.wires.length > 0 || this.buttons.length > 0 || this.labels.length > 0;
  }

  findByID(id) {
    return this.all().find((o) => o.id === id);
  }
}

// Global state of all simulation objects
const state = new State();
