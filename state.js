class State {
    constructor() {
        this.objects = [];
    }

    register(object) {
        this.objects.push(object);
    }

    unregister(object) {
        if (!object.id) return;
        const idx = this.objects.indexOf(this.objects.find(o => o.id === object.id));
        this.objects.splice(idx, 1);
    }
}

// Global state of all simulation objects
const state = new State();