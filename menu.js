class Menu {
    constructor() {
        this.io = new IO();

        const row1 = this._createMenuRow(1);
        const row2 = this._createMenuRow(2);

        this._createMenuButton("Save", () => this.io.save(), row1);
        this._createMenuButton("Load", () => this.io.load(), row1);
        this._createMenuButton("Clear", () => state.hasState() && confirm("Are you sure you want to clear? This will delete the current state.") && state.clear(), row1);
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
        button.parent(rowId ? "menu-row-" + rowId : "menu");
        button.mousePressed(onClick);
        return button;
    }

    _createToggle(text, onToggle, defaultValue = false, rowId) {
        const toggle = createCheckbox(text);
        toggle.class("toggle");
        toggle.checked(defaultValue);
        toggle.parent(rowId ? "menu-row-" + rowId : "menu");
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
        wrapper.parent(rowId ? "menu-row-" + rowId : "menu");
        slider.changed(onChange);
        return slider;
    }

    _createDropdown(text, options, onChange, rowId) {
        const dropdown = createSelect();
        dropdown.parent(rowId ? "menu-row-" + rowId : "menu");
        dropdown.changed(onChange);
        options.forEach((option) => dropdown.option(option.label, option.value));
        return dropdown;
    }
}