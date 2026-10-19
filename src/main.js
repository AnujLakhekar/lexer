// src/main.js
import {
  initializeCanvasState,
  canvasContext,
  compilerState,
  errorManager,
} from "../src/states/states.js";
import { DollarRecognizer, Point } from "./lib/onedollor.js";
import { handleFallbackArrowConnection, handleRecognizedShape } from "./compiler/geometry.js";
import { toast } from "./ui/Toaster.js";
import { initializeObjects } from "./objects/object.class.js";
import { executeGraph } from "./compiler/interpreter.js";
import { validateGraph } from "./compiler/parser.js.js";

export const recognizer = new DollarRecognizer();
let isDrawing = false;
let strokePoints = [];

window.onload = () => {
  const canvasElement = document.getElementById("compilerCanvas");
  initializeCanvasState(canvasElement);
  initializeObjects();

  document.title = "Geometry Compiler - Draw Shapes to Compile Code";

  const { canvas, ctx } = canvasContext;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  canvas.addEventListener("mousedown", (e) => {
    isDrawing = true;
    strokePoints = [];
    const x = e.clientX - canvas.offsetLeft;
    const y = e.clientY - canvas.offsetTop;
    strokePoints.push(new Point(x, y));

    ctx.beginPath();
    ctx.moveTo(x, y);
  });

  canvas.addEventListener("mousemove", (e) => {
    if (!isDrawing) return;
    const x = e.clientX - canvas.offsetLeft;
    const y = e.clientY - canvas.offsetTop;
    strokePoints.push(new Point(x, y));

    ctx.lineTo(x, y);
    ctx.stroke();
  });

  canvas.addEventListener("mouseup", () => {
    isDrawing = false;

    if (strokePoints.length > 10) {
      const result = recognizer.Recognize(strokePoints);

      if (result.Score > 0.75) {
        handleRecognizedShape(result.Name, strokePoints);
      }
      else {
        const startPoint = strokePoints[0];
        const endPoint = strokePoints[strokePoints.length - 1];


        const linearDist = Math.hypot(
          endPoint.X - startPoint.X,
          endPoint.Y - startPoint.Y,
        );

      
        if (linearDist > 40) {
         
          handleFallbackArrowConnection(
            startPoint.X,
            startPoint.Y,
            endPoint.X,
            endPoint.Y,
          );
        } else {
          toast("error", "Gesture not recognized. Draw more clearly.");
        }
      }
    }
  });

  const runBtn = document.getElementById("runButton");
  if (runBtn) {
    runBtn.addEventListener("click", () => {
      executeGraph();
    });
  }
};
