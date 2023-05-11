class ComponentBase {
  constructor(clickable, hoverable, draggable, globalRender) {
    this.id = crypto.randomUUID();
    this.isClickable = clickable;
    this.isHoverable = hoverable;
    this.isDraggable = draggable;
    this.isGlobalRender = globalRender; // If this objects needs to be rendered from sketch or not
    this.zIndexClick = 0; // Higher zIndex means it will be clicked first 
  }
}
