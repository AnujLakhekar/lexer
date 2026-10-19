import { compilerState, errorManager } from "../states/states.js";
import { toast } from "../ui/Toaster.js";
import { validateGraph } from "./parser.js.js";

/**
 * Traverses and executes the compiled canvas program graph
 */
export function executeGraph() {
  const { nodes, links } = compilerState;

  const isGraphValid = validateGraph();
  if (!isGraphValid) {
    toast("error", `Execution failed: ${errorManager.errors[0].message}`);
    return;
  }

  if (nodes.length === 0) {
    toast("Execution Error: No drawings present on canvas.");
    return;
  }

  // 1. Find Entry Nodes (Nodes that have outgoing links but NO incoming links)
  const targetIds = new Set(links.map(link => link.to));
  const entryNodes = nodes.filter(node => !targetIds.has(node.id));

  // Fallback: If it's a closed loop or single node, grab the first created node
  const startNodes = entryNodes.length > 0 ? entryNodes : [nodes[0]];

  toast("success", `binding ${startNodes.length + 1} workflows`);

  // Keep track of visited nodes to prevent infinite loops in cyclic graphs
  const visited = new Set();

  // 2. Track execution pathways sequentially
  startNodes.forEach(startNode => {
    let currentNode = startNode;

    while (currentNode && !visited.has(currentNode.id)) {
      visited.add(currentNode.id);

      // --- RUNTIME EXECUTOR STEP ---
      executeNodePayload(currentNode);
      // ------------------------------

      // Find the next linked node in the execution pipeline
      const outgoingLink = links.find(link => link.from === currentNode.id);
      if (outgoingLink) {
        currentNode = nodes.find(node => node.id === outgoingLink.to);
      } else {
        currentNode = null; // Execution chain ended naturally
      }
    }
  });

  console.log("workflow Completed cleanly.");
}

/**
 * Simple Virtual Machine Runtime Environment to process node instructions
 */
function executeNodePayload(node) {
  switch (node.type) {
    case "PRINT_NODE":
      // Clean up expression syntax if you typed things like print("hello") or just text
      const cleanPayload = node.payload.replace(/^print\(["']|["']\)$/g, '');
      
      // Send execution output directly to UI toast and console logs
      toast("success", `${cleanPayload}`);
      break;

    default:
      console.warn(`Unknown runtime node interpretation rule: ${node.type}`);
  }
}