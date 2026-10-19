import { compilerState, canvasContext, raiseError } from "../../src/states/states.js";
import { renderCanvas } from "../canvas/engine.js";


export function createTextInputAt(x, y, nodeType = "PRINT_NODE") {
  const { canvas } = canvasContext;
  if (!canvas) return;

  const input = document.createElement("input");
  input.type = "text";
  
  // Custom placeholder and default value depending on the shape type
  if (nodeType === "END_NODE") {
    input.value = "END";
    input.placeholder = "END";
  } else {
    input.placeholder = "Type text to print...";
  }

  // Position and styles...
  Object.assign(input.style, {
    position: "absolute",
    left: `${x + canvas.offsetLeft - 50}px`,
    top: `${y + canvas.offsetTop - 15}px`,
    zIndex: "10",
    background: "transparent",
    border: "none",
    borderBottom: "1px dashed #888",
    outline: "none",
    textAlign: "center",
    font: "14px monospace",
    color: nodeType === "END_NODE" ? "#ef4444" : "#000" // Red text for endpoints
  });

  document.body.appendChild(input);
  input.focus();
  if (nodeType === "END_NODE") input.select(); // Highlight "END" text for easy replacement

  let isCleaningUp = false; 

  const saveAndCleanup = (text) => {
    if (isCleaningUp) return;
    isCleaningUp = true; 

    if (text.trim()) {
      const nodeId = `node_${crypto.randomUUID ? crypto.randomUUID().slice(0, 8) : Date.now()}`;

      compilerState.nodes.push({
        id: nodeId,
        type: nodeType, 
        payload: text.trim(),
        x,
        y,
      });

      renderCanvas();
    }
    input.remove();
  };

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") saveAndCleanup(input.value);
    if (e.key === "Escape") { isCleaningUp = true; input.remove(); }
  });

  input.addEventListener("focusout", () => saveAndCleanup(input.value));
}