// src/state.js
export const compilerState = {
  nodes: [],
  links: [],
};

export const canvasContext = {
  canvas: null,
  ctx: null,
};


class CompilerError {
  constructor() {
    this.errors = [];
  }

  // Changed name slightly to avoid reserved keyword conflicts
  raise(message, nodeId = `error_${Date.now()}`) {
    const error = {
      nodeId,
      message,
      timestamp: Date.now(),
    };
    this.errors.push(error);
    return error;
  }

  remove(nodeId) {
    this.errors = this.errors.filter((e) => e.nodeId !== nodeId);
  }

  clear() {
    this.errors = [];
  }
}

// 1. Instantiate the error manager instance
export const errorManager = new CompilerError();

// 2. Safely alias and bind the methods to preserve class context scope
export const raiseError = errorManager.raise.bind(errorManager);
export const removeError = errorManager.remove.bind(errorManager);
export const clearErrors = errorManager.clear.bind(errorManager);

export function initializeCanvasState(canvasElement) {
  canvasContext.canvas = canvasElement;
  canvasContext.ctx = canvasElement.getContext("2d");
}
