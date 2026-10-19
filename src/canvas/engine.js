import { compilerState, canvasContext } from "../states/states.js";

export function renderCanvas() {
  const { canvas, ctx } = canvasContext;
  if (!canvas || !ctx) return;

  // 1. CLEAR THE ENTIRE CANVAS GRID (Wipes out old freehand tracks)
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 2. REDRAW ALL VALID STRUCTURAL NODES
  compilerState.nodes.forEach((node) => {
    if (node.type === "PRINT_NODE") {
      drawCircleNodeElement(ctx, node);
    } else if (node.type === "END_NODE") {
      drawCapsuleNodeElement(ctx, node);
    }
  });

  // 3. REDRAW ALL VALID INSTANCED LINKS
  compilerState.links.forEach((link) => {
    // This draws your sharp, snapped geometric arrows between connected circles
    drawArrowGeometry(
      link.points.startX,
      link.points.startY,
      link.points.endX,
      link.points.endY,
    );
  });
}

// Helper to draw your node circles cleanly so they persist after clearRect
function drawCircleNodeElement(ctx, node) {
  ctx.beginPath();
  ctx.arc(node.x, node.y, 40, 0, 2 * Math.PI); // Assuming 40px radius
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#000";
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.stroke();

  // Render text payload inside the circle
  ctx.fillStyle = "#000";
  ctx.font = "12px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(node.payload || "", node.x, node.y);
}

export function drawArrowGeometry(initialX, initialY, finalX, finalY) {
  const { ctx } = canvasContext;
  if (!ctx) return;

  const headlen = 12;
  const angle = Math.atan2(finalY - initialY, finalX - initialX);

  ctx.beginPath();
  ctx.moveTo(initialX, initialY);
  ctx.lineTo(finalX, finalY);

  // Left side of arrow tip
  ctx.lineTo(
    finalX - headlen * Math.cos(angle - Math.PI / 6),
    finalY - headlen * Math.sin(angle - Math.PI / 6),
  );

  // Right side of arrow tip
  ctx.moveTo(finalX, finalY);
  ctx.lineTo(
    finalX - headlen * Math.cos(angle + Math.PI / 6),
    finalY - headlen * Math.sin(angle + Math.PI / 6),
  );

  ctx.lineWidth = 2;
  ctx.strokeStyle = "#000";
  ctx.stroke();
}

function drawCapsuleNodeElement(ctx, node) {
  const width = 100;
  const height = 40;
  const x = node.x - width / 2;
  const y = node.y - height / 2;
  const radius = height / 2;

  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();

  ctx.lineWidth = 3; // Slightly thicker border for emphasis
  ctx.strokeStyle = "#ef4444"; // Crimson red terminal state indicator
  ctx.fillStyle = "#fef2f2"; // Light pink background tint
  ctx.fill();
  ctx.stroke();

  // Draw node text payload
  ctx.fillStyle = "#991b1b";
  ctx.font = "bold 13px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(node.payload || "END", node.x, node.y);
}
