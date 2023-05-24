class Output extends ComponentBase {
    constructor(x, y, w, h) {
        super(true, true, true, true);
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.on = false;
        this.inWires = [];
        this.type = "input"; // TODO: This is a bit hacky, but it works for now

        // TODO: Does an output need a label?
        this.label = state.register(new Label(this.x + this.w / 2 + 10, this.y - this.h / 2 - 10, "Lorem Ipsum"));
    }

    _applyBorder() {
        strokeWeight(Globals.StrokeWeight);
        GetScheme().White.applyStroke();
    }

    _applyFill() {
        if (this.on) {
            GetScheme().SignalOn.applyFill();
        } else {
            GetScheme().ClickArea.applyFill();
        }
    }

    _renderLabel() {
        this.label.render();
    }

    updatePosition(x, y) {
        this.x = x;
        this.y = y;

        this.label.x = this.x + this.w / 2 + 10;
        this.label.y = this.y - this.h / 2 - 10;
    }

    mouseIsOver() {
        const isWithinCircle = () => {
            return dist(mouseX, mouseY, this.x, this.y) < this.w / 2;
        };
        return isWithinCircle();
    }

    logic() {
        const newState = this.inWires.some((w) => w.on);
        if (newState && this.on === false) {
            this.on = true;
        } else if (!newState && this.on === true) {
            this.on = false;
        }
    }

    render() {
        this._applyBorder();
        this._applyFill();

        ellipse(this.x, this.y, this.w, this.h);
        this._renderLabel();
    }

    delete() {
        state.unregister(this);
    }

    onClick(mouseButton) {
        if (mouseButton === RIGHT) {
            this.delete();
        }
    }

    removeWire(wire) {
        const inWireIdx = this.inWires.findIndex((w) => w.id === wire.id);
        if (inWireIdx >= 0) {
            this.inWires.splice(inWireIdx, 1);
        }
    }

}