class State {
  constructor() {
    this.objectCounter = 0;
    this.state = {};
    this.objects = {};
    this._setupState();

    this.allCache = null;
  }

  _setupState() {
    this._setStateDefinition("Gate", "gates");
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
      objects: []
    };
  }

  _getType(object) {
    return object.constructor.name;
  }

  _updateShorthands() {
    Object.keys(this.state).forEach((key) => {
      this.objects[this.state[key].arrayShorthand] = this.state[key].objects;
    })
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
    console.log("Updated 'all' cache");
  }

  register(object, loadingFromJson = false) {
    const type = this._getType(object);
    if (!this.state[type]) { return; }

    this.state[type].objects.push(object);

    if (object instanceof Label) {
      object.zIndexClick = 100; // Labels should be clicked first
    }

    this.objectCounter++;
    if (!loadingFromJson) {
      object.id = this.objectCounter;
    }

    console.log("Registering", object.constructor.name, "with id", object.id, "to list", type);
    this._updateShorthands();
    this._updateAllCache();
    return object;
  }


  unregister(object) {
    if (!object.id) return;

    const type = this._getType(object);
    if (!this.state[type]) { return; }
    const idx = this._idx(this.state[type].objects, object);
    if (idx >= 0) {
      this.state[type].objects.splice(idx, 1);
      console.log("Unregistering", object.constructor.name, "with id", object.id, "from list", type);
    }
  }

  all() {
    if (this.allCache) {
      return this.allCache;
    }

    this._updateAllCache();
    return this.allCache;
  }

  toJson() {
    return JSON.stringify({ gates: this.state["Gate"].objects.map(g => g.reduce()), wires: this.state["Wire"].objects.map(w => w.reduce()) }, null, 2);
  }

  clear() {
    Object.keys(this.state).forEach((key) => {
      if (key !== "ClickArea") {
        this.state[key].objects = [];
        this.objects[this.state[key].arrayShorthand] = [];
      }
    });
    this.objectCounter = 0;
  }

  hasState() {
    let result = false;
    Object.keys(this.state).forEach((key) => {
      console.log("Checking hasState for key", key, this.state[key].objects.length);
      if (this.state[key].objects.length > 0 && key !== "ClickArea") {
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
