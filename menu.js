class Menu {
    constructor() {
        this.io = new IO();
        this.saveButton = this._createMenuButton("Save", () => this.io.save());
        this.loadButton = this._createMenuButton("Load", () => this.io.load());
        this.clearButton = this._createMenuButton("Clear", () => state.hasState() && confirm("Are you sure you want to clear? This will delete the current state.") && state.clear());
        this.toggleGridCheckbox = this._createToggle("Show grid", () => Settings.ShowGrid = !Settings.ShowGrid, true);
        this.toggleGridCheckbox = this._createToggle("Snap to grid", () => Settings.SnapToGrid = !Settings.SnapToGrid, true);
        this.gridSizeSlider = this._createSlider("Grid size", 10, 50, Settings.GridCellSize, 10, (e) => { Settings.GridCellSize = parseInt(e.target.value); });
        this.themeDropdown = this._createDropdown("Theme", [{ label: "Blueprint (default)", value: 'default' }, { label: "Dunkelheit", value: 'dark' }], (e) => { Settings.Theme = e.target.value; });
    }

    _createMenuButton(text, onClick) {
        const button = createButton(text);
        button.parent("menu");
        button.mousePressed(onClick);
        return button;
    }

    _createToggle(text, onToggle, defaultValue = false) {
        const toggle = createCheckbox(text);
        toggle.class("toggle");
        toggle.checked(defaultValue);
        toggle.parent("menu");
        toggle.changed(onToggle);
        return toggle;
    }

    _createSlider(text, min, max, defaultValue, step, onChange) {
        const label = createSpan(text);
        const slider = createSlider(min, max, defaultValue, step);
        const wrapper = createDiv();
        wrapper.class("slider");
        label.parent(wrapper);
        slider.parent(wrapper);
        wrapper.parent("menu");
        slider.changed(onChange);
        return slider;
    }

    _createDropdown(text, options, onChange) {
        const dropdown = createSelect();
        dropdown.parent("menu");
        dropdown.changed(onChange);
        options.forEach((option) => dropdown.option(option.label, option.value));
        return dropdown;
    }
}