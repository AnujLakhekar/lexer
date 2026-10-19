import { compilerState, raiseError } from "../../src/states/states.js";
import { createTextInputAt } from "../ui/domOverlay.js";
import { renderCanvas, drawArrowGeometry } from "../canvas/engine.js";
import { toast } from "../ui/Toaster.js";

/**
 * Main orchestrator for newly recognized gestures from the $1 library
 */
export function handleRecognizedShape(shapeName, points) {
  if (!points || points.length === 0) return;

  // DEFENSIVE FIX: Support both lowercase 'x' and uppercase 'X' properties seamlessly
  const xs = points.map((p) => (p.x !== undefined ? p.x : p.X));
  const ys = points.map((p) => (p.y !== undefined ? p.y : p.Y));

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const centerX = minX + (maxX - minX) / 2;
  const centerY = minY + (maxY - minY) / 2;

  // src/compiler/geometry.js -> handleRecognizedShape()

  switch (shapeName.toLowerCase()) {
    case "circle":
      createTextInputAt(centerX, centerY, "PRINT_NODE");
      break;

    case "capsule": 
      createTextInputAt(centerX, centerY, "END_NODE");
      break;

    case "arrow":
      const startX = xs[0];
      const startY = ys[0];
      const endX = xs[xs.length - 1];
      const endY = ys[ys.length - 1];
      handleArrowConnection(startX, startY, endX, endY);
      break;
  }
}

/**
 * Logic-based connector linking two closest structural nodes
 */
function handleArrowConnection(startX, startY, endX, endY) {
  const maxDistance = 150; // Pixels snap boundary radius

  const findClosestNode = (px, py) => {
    let closest = null;
    let minDist = maxDistance;

    for (const node of compilerState.nodes) {
      // Defensive fallback check for structural nodes properties
      const nodeX = node.x !== undefined ? node.x : node.X;
      const nodeY = node.y !== undefined ? node.y : node.Y;

      const dist = Math.hypot(nodeX - px, nodeY - py);

      if (dist < minDist) {
        minDist = dist;
        closest = node;
      }
    }
    return closest;
  };

  const sourceNode = findClosestNode(startX, startY);
  const targetNode = findClosestNode(endX, endY);

  if (sourceNode && targetNode && sourceNode.id !== targetNode.id) {
    const linkExists = compilerState.links.some(
      (l) => l.from === sourceNode.id && l.to === targetNode.id,
    );

    if (!linkExists) {
      compilerState.links.push({
        from: sourceNode.id,
        to: targetNode.id,
        points: {
          startX: sourceNode.x || sourceNode.X,
          startY: sourceNode.y || sourceNode.Y,
          endX: targetNode.x || targetNode.X,
          endY: targetNode.y || targetNode.Y,
        },
      });

      toast("info", `Connected ${sourceNode.id} ---> ${targetNode.id}`);
      renderCanvas();
    }
  } else {
    // Render the raw canvas drawing representation safely anyway
    drawArrowGeometry(startX, startY, endX, endY);
  }
}

export function handleFallbackArrowConnection(startX, startY, endX, endY) {
  // We use a slightly wider snap radius (160px) to accommodate loose freehand lines
  const maxDistance = 160;

  const findClosestNode = (px, py) => {
    let closest = null;
    let minDist = maxDistance;

    for (const node of compilerState.nodes) {
      const nodeX = node.x !== undefined ? node.x : node.X;
      const nodeY = node.y !== undefined ? node.y : node.Y;
      const dist = Math.hypot(nodeX - px, nodeY - py);

      if (dist < minDist) {
        minDist = dist;
        closest = node;
      }
    }
    return closest;
  };

  const sourceNode = findClosestNode(startX, startY);
  const targetNode = findClosestNode(endX, endY);

  if (sourceNode && targetNode && sourceNode.id !== targetNode.id) {
    const linkExists = compilerState.links.some(
      (l) => l.from === sourceNode.id && l.to === targetNode.id,
    );

    if (!linkExists) {
      compilerState.links.push({
        from: sourceNode.id,
        to: targetNode.id,
        points: {
          startX: sourceNode.x || sourceNode.X,
          startY: sourceNode.y || sourceNode.Y,
          endX: targetNode.x || targetNode.X,
          endY: targetNode.y || targetNode.Y,
        },
      });

      toast(
        "success",
        `Connected: ${sourceNode.payload} ➔ ${targetNode.payload}`,
      );
      renderCanvas();
    }
  } else {
    // If they just scribbled in empty space, clean-render it as a cosmetic vector line
    drawArrowGeometry(startX, startY, endX, endY);
  }
}
