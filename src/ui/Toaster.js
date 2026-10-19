export function toast(type = "info", message = "This is a toast") {
  // Base configuration mimicking Radix UI / Shadcn
  let toastConfig = {
    text: message,
    duration: 3000,
    gravity: "top",
    position: "right",
    close: true, // Shadcn toasts usually have a close button
    stopOnFocus: true,
    style: {
      // Base Radix/Shadcn theme styles (Dark mode style layout)
      background: "#09090b",       // shadcn background (zinc-950)
      color: "#fafafa",            // shadcn foreground (zinc-50)
      border: "1px solid #27272a", // shadcn border (zinc-800)
      borderRadius: "0.5rem",      // md radius
      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.5)",
      fontFamily: "ui-sans-serif, system-ui, sans-serif",
      fontSize: "0.875rem",        // text-sm
      padding: "12px 16px",
    }
  };

  // Modify styles based on the type
  switch (type) {
    case "success":
      // Light text, subtle success accent if desired (or keep it neutral)
      toastConfig.style.background = "#09090b"; 
      toastConfig.style.border = "1px solid #22c55e"; // green-500 border
      break;
      
    case "error":
      // Shadcn destructive toast variant
      toastConfig.style.background = "#7f1d1d"; // destructive background (red-950)
      toastConfig.style.color = "#fef2f2";      // destructive foreground (red-50)
      toastConfig.style.border = "1px solid #dc2626"; // red-600 border
      break;
      
    case "info":
    default:
      // Standard default neutral shadcn toast
      break;
  }

  // Trigger the toast
  Toastify(toastConfig).showToast();
}