class State {
    constructor() {
        this.gates = [];
        this.pins = [];
        this.wires = [];
        this.objectCounter = 0;
    }

    register(object) {
        if (object instanceof Gate) {
            this.gates.push(object);
        }
        if (object instanceof Pin) {
            this.pins.push(object);
        }
        if (object instanceof Wire) {
            this.wires.push(object);
        }

        this.objectCounter++;
        object.id = this.objectCounter;
    }

    _maybeUnregister(list, object, listName) {
        const idx = this._idx(list, object);
        if (idx >= 0) {
            list.splice(idx, 1);
            console.log("Unregistering", object.constructor.name, "with id", object.id, "from list", listName);
        }
    }

    _idx(list, object) {
        return list.indexOf(list.find(o => o.id === object.id));
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
    }

    all() {
        return [...this.gates, ...this.pins, ...this.wires];
    }
}

// Global state of all simulation objects
const state = new State();