class IO {
    constructor() { }

    _loadRaw() {
        return localStorage.getItem('state');
    }

    _loadGates(stateObj) {
        stateObj.gates.forEach((g) => {
            const gate = new Gate(g.x, g.y, g.w, g.h, getGateByName(g.gate.label), true);
            gate.id = g.id;
            state.register(gate, true);
        });
    }

    _loadPins(stateObj) {
        stateObj.gates.forEach((g) => {
            const gate = state.findByID(g.id);
            g.inputs.forEach((p) => {
                const pin = gate.addInput();
                pin.id = p.id;
                state.register(pin, true);
            });

            g.outputs.forEach((p) => {
                const pin = gate.addOutput();
                pin.id = p.id;
                state.register(pin, true);
            });
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
            state.register(wire, true);
        });
    }

    save() {
        if (!!this._loadRaw() && !confirm("Are you sure you want to save? This will overwrite the current state.")) return;

        const stateJson = state.toJson();
        console.log("Saving...", stateJson);
        localStorage.setItem('state', stateJson);
    }

    load() {
        if (state.hasState() && !confirm("Are you sure you want to load? This will clear the current state.")) return;

        const stateJson = this._loadRaw();
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
        this._loadWires(stateObj);
    }
}