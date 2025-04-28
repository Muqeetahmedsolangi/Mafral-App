// Example of how to fix an import in any component that uses maps
import { Platform } from "react-native";

// Import MapView safely
let MapView: any = null;
let Marker: any = null;

if (Platform.OS !== "web") {
  try {
    const Maps = require("react-native-maps");
    MapView = Maps.default;
    Marker = Maps.Marker;
  } catch (err) {
    console.warn("Could not load react-native-maps:", err);
  }
}
