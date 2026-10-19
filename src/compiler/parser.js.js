import { clearErrors, compilerState, errorManager, raiseError } from "../states/states.js";
import { toast } from "../ui/Toaster.js";

/**
 * Validates the compiler graph syntax before execution begins
 * @returns {boolean} True if code is safe to compile and run
 */
export function validateGraph() {
  // Clear out any stale compile errors from the last validation pass
  clearErrors();

  const { nodes, links } = compilerState;

  // RULE 1: Empty Canvas Guard
  if (nodes.length === 0) {
    raiseError("no drawings present on canvas");
    return false;
  }

  // Look for structural issues across individual blocks
  nodes.forEach((node) => {
    const incoming = links.filter((l) => l.to === node.id);
    const outgoing = links.filter((l) => l.from === node.id);

    // RULE 2: Check for syntax/type mismatch (Empty Input blocks)
    if (node.type === "PRINT_NODE" && (!node.payload || node.payload.trim() === "")) {
      raiseError(`Syntax Error: Expression payload block cannot be empty.`, node.id);
    }

    // RULE 3: Detect Dead Ends (Nodes with incoming links but nowhere to go)
    // Exclude terminal shapes if you've added them!
    if (incoming.length > 0 && outgoing.length === 0 && node.type !== "END_NODE") {
      raiseError(`Warning: Dangling expression path execution terminates abruptly here.`, node.id);
    }
  });

  // Print out a structural status report
  if (errorManager.errors.length > 0) {
    console.error("Graph Compilation Failed! Diagnostics:", errorManager.errors);
    
    // Fire off the first error message to the UI
    toast("error", errorManager.errors[0].message);
    return false;
  }

  console.log("Static Code Analysis Phase: Passed cleanly.");
  return true;
}