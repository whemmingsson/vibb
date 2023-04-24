class Connector extends ComponentBase {
    constructor(x, y, h, parentComponent, type) {
        super(true, true, false, false);
        this.x = x;
        this.y = y;
        this.w = Globals.ConnectorWidth;
        this.h = h;

        this.parentComponent = parentComponent;
        this.type = type;
        this.on = false;

        this.wires = [];
        this.inWires = [];
        this.outWires = [];
    }

    _applyBorder() {
        if (this.mouseIsOver()) {
            strokeWeight(2);
            stroke(100, 0, 100);
        } else {
            noStroke();
        }
    }

    _applyFill() {
        if (this.on) ColorScheme.SignalOn.applyFill();
        else ColorScheme.SignalOff.applyFill();
    }

    removeWire(wire) {
        const inWireIdx = this.inWires.findIndex(w => w.id === wire.id);
        if (inWireIdx >= 0) {
            this.inWires.splice(inWireIdx, 1);
        }
        const outWireIdx = this.outWires.findIndex(w => w.id === wire.id);
        if (outWireIdx >= 0) {
            this.outWires.splice(outWireIdx, 1);
        }

        if (outWireIdx >= 0 || inWireIdx >= 0) {
            state.unregister(wire);
        }
    }

    _renderWires() {
        const wires = [...this.inWires, ...this.outWires];
        wires.forEach(w => w.render());
    }

    toggle(signal) {
        this.on = signal;
        this.outWires.forEach(wire => wire.on = signal)
    }

    applyInputSignal() {
        if (this.inWires.length === 0)
            return;

        if (this.inWires.some(wire => wire.on)) {
            this.on = true;
        }
        else {
            this.on = false;
        }
    }

    render() {
        this._renderWires();
        this._applyFill();
        this._applyBorder();
        if (this.type === "input") arc(this.x, this.y, this.w, this.h, PI / 2, PI / 2 + PI, PIE);
        else if (this.type === "output") arc(this.x, this.y, this.w, this.h, PI / 2 + PI, PI / 2 + PI + PI, PIE);
    }

    mouseIsOver() {
        if (this.type === "input") return dist(mouseX, mouseY, this.x, this.y) < this.w / 2 && mouseX < this.x;
        if (this.type === "output") return dist(mouseX, mouseY, this.x, this.y) < this.w / 2 && mouseX > this.x;
    }

    onClick(mouseButton) {
        if (mouseButton === RIGHT) {
            if (this.type === "input") this.parentComponent.removeInput(this);
            else if (this.type === "output") this.parentComponent.removeOutput(this);
        } else if (mouseButton === LEFT && this.type === "input") {
            if (this.inWires.length > 0) {
                alert("You cannot activate this input - it has a wire going into it");
                return;
            }
            this.on = !this.on;
        }
    }
}
