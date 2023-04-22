class Connector extends ComponentBase {
    constructor(x, y, h, parentComponent, type) {
        super(true, true, false, false);
        this.x = x;
        this.y = y;
        this.color = new Color(20, 360, 60);
        this.w = Globals.ConnectorWidth;
        this.h = h;

        this.label = "Input " + this.id;
        this.parentComponent = parentComponent;
        this.type = type;
    }

    _applyBorder() {
        if (this.mouseIsOver()) {
            strokeWeight(2);
            stroke(100, 0, 100);
        }
        else {
            noStroke();
        }
    }

    render() {
        this.color.applyFill();
        this._applyBorder();
        arc(this.x, this.y, this.w, this.h, PI / 2, PI / 2 + PI, PIE);
    }

    mouseIsOver() {
        return dist(mouseX, mouseY, this.x, this.y) < this.w / 2 && mouseX < this.x;
        //return mX > this.x && mX < this.x + this.w && mY > this.y && mY < this.y + this.h;
    }

    onClick() {
        this.parentComponent.removeInput(this);
    }
}