// src/objects/object.class.js
import { recognizer } from "../main.js";
import { Point } from "../lib/onedollor.js"; // Import Point definition
import zPoints from "../objects/z.object.js"; // Import the Z shape points from the JSON file
import capsulePoints from "./capsule.object.js";


const objects = {
  zPoints,
  capsulePoints
};

class CustomGesture {
  constructor(rawPoints, name) {
    this.name = name;
    
    // Convert raw JSON configurations into formal Point object instances
    this.points = rawPoints.map(p => new Point(p.x, p.y));
  }

  getPoints() {
    return this.points;
  }

  getName() {
    return this.name;
  }

  create() {
    // Pass the instanced points vector array into the recognizer
    recognizer.AddGesture(this.name, this.points); 
    // ^ CRITICAL FIX: The $1 signature structure is AddGesture(name, points array)
  }
  
  remove() {
    recognizer.RemoveGesture(this.name);
  }
}

export function initializeObjects() {
  for (const key in objects) {
    const objData = objects[key];
    const gesture = new CustomGesture(objData.points, objData.name);
    gesture.create();
    console.log(`Initialized gesture: ${gesture.getName()} with ${gesture.getPoints().length} points.`);
  }
}

export default CustomGesture;