// src/objects/capsule.points.js

const capsulePoints = {
  name: "capsule",
  points: [
    // Starting along the top edge, moving left to right
    { x: 140, y: 110 }, 
    { x: 180, y: 105 }, 
    { x: 220, y: 105 }, 
    { x: 250, y: 112 }, 
    
    // Smooth right curve dropping down
    { x: 270, y: 122 }, 
    { x: 275, y: 135 }, 
    { x: 265, y: 145 }, 
    
    // Bottom edge sweeping right to left
    { x: 230, y: 152 }, 
    { x: 180, y: 155 }, 
    { x: 130, y: 152 }, 
    
    // Smooth left curve lifting up to close the loop
    { x: 105, y: 142 }, 
    { x: 100, y: 130 }, 
    { x: 112, y: 118 }, 
    { x: 140, y: 110 }  // Back to start
  ]
};

export default capsulePoints;