class Menu {
    constructor() {
        this.io = new IO();

        const row1 = this._createMenuRow(1);
        const row2 = this._createMenuRow(2);

        // Row 1 - Input/Output
        const sketchNameInput = this._createTextInput(`sketch_${DateUtils.getToday()}`, row1);
        this._createMenuButton("Save", () => {
            if (!sketchNameInput.value()) return alert("Please enter a sketch name.");
            if (!state.hasState()) return alert("There is nothing to save.");
            this.io.save(sketchNameInput.value());
            this.reloadOptions();
        }, row1);

        // We need to reload the options after saving - this is a bit hacky
        this.sketchDropdown = this._createDropdown("Load", [{ label: "Select a sketch", value: "" }].concat(this.io.getSavedSketchesNames().map((name) => { return { label: name, value: name } })), null, row1);

        this._createMenuButton("Load", () => {
            if (!this.sketchDropdown.value()) return alert("Please select a sketch to load.");
            sketchNameInput.value(this.sketchDropdown.value());
            this.io.load(this.sketchDropdown.value());
        }, row1);

        this._createMenuButton("Clear", () => state.hasState() && confirm("Are you sure you want to clear? This will delete the current state.") && state.clear(), row1);

        // Row 2 - Settings
        this._createToggle("Show grid", () => Settings.ShowGrid = !Settings.ShowGrid, true, row2);
        this._createToggle("Snap to grid", () => Settings.SnapToGrid = !Settings.SnapToGrid, true, row2);
        this._createSlider("Grid size", 10, 50, Settings.GridCellSize, 10, (e) => { Settings.GridCellSize = parseInt(e.target.value); }, row2);
        this._createDropdown("Theme", [{ label: "Blueprint (default)", value: 'default' }, { label: "Dunkelheit", value: 'dark' }], (e) => { Settings.Theme = e.target.value; }, row2);
        this._createMenuButton("Create truth table", () => TruthTableUtils.generate(), row2);
    }

    _createMenuRow(id) {
        const row = createDiv();
        row.class("menu-row");
        row.id("menu-row-" + id);
        row.parent("menu");
        return id;
    }

    _createMenuButton(text, onClick, rowId) {
        const button = createButton(text);
        this._setParent(button, rowId);
        button.mousePressed(onClick);
        return button;
    }

    _setParent(button, rowId) {
        button.parent(rowId ? "menu-row-" + rowId : "menu");
    }

    _createToggle(text, onToggle, defaultValue = false, rowId) {
        const toggle = createCheckbox(text);
        toggle.class("toggle");
        toggle.checked(defaultValue);
        this._setParent(toggle, rowId);
        toggle.changed(onToggle);
        return toggle;
    }

    _createSlider(text, min, max, defaultValue, step, onChange, rowId) {
        const label = createSpan(text);
        const slider = createSlider(min, max, defaultValue, step);
        const wrapper = createDiv();
        wrapper.class("slider");
        label.parent(wrapper);
        slider.parent(wrapper);
        this._setParent(wrapper, rowId);
        slider.changed(onChange);
        return slider;
    }

    _createDropdown(text, options, onChange, rowId) {
        const dropdown = createSelect();
        this._setParent(dropdown, rowId);
        if (onChange) dropdown.changed(onChange);
        options.forEach((option) => dropdown.option(option.label, option.value));
        return dropdown;
    }

    _createTextInput(text, rowId) {
        const input = createInput(text);
        this._setParent(input, rowId);
        return input;
    }

    reloadOptions() {
        const sketchDropdown = this.sketchDropdown;
        sketchDropdown.html("");
        sketchDropdown.option("Select a sketch", "");
        this.io.getSavedSketchesNames().forEach((name) => sketchDropdown.option(name, name));
    }
}