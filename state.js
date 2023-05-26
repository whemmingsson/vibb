class State {
  constructor() {
    this.state = {};
    this.objects = {};
    this.allCache = null;
    this._setupState();
  }

  _setupState() {
    this._setStateDefinition("Gate", "gates");
    this._setStateDefinition("GateTemplate", "templates");
    this._setStateDefinition("Pin", "pins");
    this._setStateDefinition("Wire", "wires");
    this._setStateDefinition("Button", "buttons");
    this._setStateDefinition("Output", "outputs");
    this._setStateDefinition("ClickArea", "clickAreas");
    this._setStateDefinition("Label", "labels");
  }

  _setStateDefinition(type, arrayShorthand) {
    this.state[type] = this._createStateDefinition(type, arrayShorthand);
  }

  _createStateDefinition(type, arrayShorthand) {
    return {
      type: type,
      arrayShorthand: arrayShorthand,
      objects: [],
    };
  }

  _getType(object) {
    return object.constructor.name;
  }

  _updateShorthands() {
    Object.keys(this.state).forEach((key) => {
      this.objects[this.state[key].arrayShorthand] = this.state[key].objects;
    });
  }

  _idx(list, object) {
    return list.indexOf(list.find((o) => o.id === object.id));
  }

  _updateAllCache() {
    const result = [];
    Object.keys(this.state).forEach((key) => {
      result.push(...this.state[key].objects);
    });

    this.allCache = result.sort((a, b) => b.zIndexClick - a.zIndexClick);
  }

  _belongsToGateTemplate(object) {
    return object.parentComponent && object.parentComponent instanceof GateTemplate;
  }

  _belongsToGateTemplateArr(array) {
    return array.some((o) => this._belongsToGateTemplate(o));
  }

  register(object) {
    const type = this._getType(object);
    if (!this.state[type]) {
      return;
    }

    this.state[type].objects.push(object);

    if (object instanceof Label) {
      object.zIndexClick = 100; // Labels should be clicked first
    }

    this._updateShorthands();
    this._updateAllCache();
    return object;
  }

  unregister(object) {
    if (!object.id) return;

    const type = this._getType(object);
    if (!this.state[type]) {
      return;
    }

    const idx = this._idx(this.state[type].objects, object);
    if (idx >= 0) {
      this.state[type].objects.splice(idx, 1);
    }

    this._updateShorthands();
    this._updateAllCache();
  }

  all() {
    if (!this.allCache) {
      this._updateAllCache();
    }

    return this.allCache;
  }

  toJson() {
    return JSON.stringify(
      {
        gates: this.state["Gate"].objects.map((g) => g.reduce()),
        wires: this.state["Wire"].objects.map((w) => w.reduce()),
        buttons: this.state["Button"].objects.map((b) => b.reduce()),
        outputs: this.state["Output"].objects.map((o) => o.reduce())
      }, null, 2);
  }

  clear() {
    Object.keys(this.state).forEach((key) => {
      if (key !== "ClickArea" && key !== "GateTemplate") {
        this.state[key].objects = [];
        this.objects[this.state[key].arrayShorthand] = [];
      }
    });
  }

  hasState() {
    let result = false;
    Object.keys(this.state).forEach((key) => {
      console.log("Checking hasState for key", key, this.state[key].objects.length);
      if (this.state[key].objects.length > 0 && !this._belongsToGateTemplateArr(this.state[key].objects) && key !== "ClickArea" && key !== "GateTemplate") {
        result = true;
      }
    });
    return result;
  }

  findByID(id) {
    return this.all().find((o) => o.id === id);
  }
}

// Global state of all simulation objects
const state = new State();
