class Color {
    constructor(h, s, b) {
        this.h = h;
        this.s = s;
        this.b = b;
    }

    applyFill() {
        fill(this.h, this.s, this.b)
    }

}

const Globals = {
    ConnectorWidth: 50,
    ConnectorSpacing: 2
}