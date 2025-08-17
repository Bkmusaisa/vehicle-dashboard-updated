// TEMPORARY TEST - PUT THIS FIRST
console.log("Script loaded successfully");
alert("Leaflet available? " + (typeof L !== 'undefined'));

const testMap = L.map("map").setView([11.1523, 7.6548], 14);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(testMap);
L.marker([11.1523, 7.6548]).bindPopup("TEST MARKER").addTo(testMap);
// Configuration
const SCRIPT_ID = "AKfycbwp8MJezh9XjFHayC0BlL_MCAn_v2SkV90jmEls-cGrFyfmTtSNx-ZAGxguqC-kg1dV";
const ADMIN_LAT = 11.1523;
const ADMIN_LNG = 7.6548;

// URL Configuration
const PROD_URL = `https://script.google.com/macros/s/${SCRIPT_ID}/exec`;

// Map Initialization - VERIFIED PARENTHESIS
const map = L.map("map").setView([ADMIN_LAT, ADMIN_LNG], 14);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Admin Marker - VERIFIED PARENTHESIS
L.marker([ADMIN_LAT, ADMIN_LNG], { 
  icon: L.divIcon({ 
    className: 'admin-marker',
    html: '⬤',
    iconSize: [20, 20]
  })
}).bindPopup("Admin Location - ABU Senate Building").addTo(map);

// Vehicle Tracking
const vehicleMarkers = {};
const vehicleTrails = {};

// Fetch Function - VERIFIED PARENTHESIS
async function fetchData() {
  try {
    const url = `${PROD_URL}?t=${Date.now()}`;
    const response = await fetch(url);
    
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    
    const result = await response.json();
    if (!result?.data) throw new Error("Invalid data format");
    
    updateMap(result.data);
  } catch (error) {
    console.error("Fetch error:", error);
    setTimeout(fetchData, 10000);
  }
}

// Update Map - VERIFIED PARENTHESIS
function updateMap(vehicles) {
  vehicles.forEach(vehicle => {
    const { VehicleID, Lat, Lng, Time } = vehicle;
    if (!Lat || !Lng) return;

    const color = vehicleColors[VehicleID] || "black";
    const popupContent = `${VehicleID}<br>Time: ${Time || "N/A"}`;

    if (vehicleMarkers[VehicleID]) {
      vehicleMarkers[VehicleID]
        .setLatLng([Lat, Lng])
        .setPopupContent(popupContent);
    } else {
      vehicleMarkers[VehicleID] = L.circleMarker([Lat, Lng], {
        color: color,
        radius: 8
      }).addTo(map).bindPopup(popupContent);
    }

    if (!vehicleTrails[VehicleID]) {
      vehicleTrails[VehicleID] = L.polyline([[Lat, Lng]], { 
        color: color 
      }).addTo(map);
    } else {
      vehicleTrails[VehicleID].addLatLng([Lat, Lng]);
    }
  });
}

// Vehicle Colors - VERIFIED PARENTHESIS
const vehicleColors = {
  "Vehicle 1": "blue",
  "Vehicle 2": "green",
  "Vehicle 3": "red",
  "Vehicle 4": "orange",
  "Vehicle 5": "purple"
};

// Initialize - VERIFIED PARENTHESIS
document.addEventListener("DOMContentLoaded", () => {
  fetchData();
  setInterval(fetchData, 5000);
});