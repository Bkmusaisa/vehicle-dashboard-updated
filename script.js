// Configuration
const sheetURL = "https://script.google.com/macros/s/AKfycbwrGelGMLzOhq0EopHZLRJlPtROj_BaF9XivCXmcqwKopD3TC3Tz2RpvGRnjQe1k9uD/exec";
const ADMIN_LAT = 11.1523;
const ADMIN_LNG = 7.6548;

const vehicleColors = {
  "Vehicle 1": "blue",
  "Vehicle 2": "green",
  "Vehicle 3": "red",
  "Vehicle 4": "orange",
  "Vehicle 5": "purple"
};

// Initialize map
let map = L.map("map").setView([ADMIN_LAT, ADMIN_LNG], 14);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19
}).addTo(map);

// Admin marker
L.marker([ADMIN_LAT, ADMIN_LNG], { 
  icon: L.divIcon({ 
    className: 'admin-marker', 
    html: '⬤', 
    iconSize: [20, 20] 
  }) 
}).bindPopup("Admin Location - ABU Senate Building").addTo(map);

let vehicleMarkers = {};
let vehicleTrails = {};

async function fetchData() {
  try {
    const url = `${sheetURL}?t=${Date.now()}`;
    console.log("[1] Starting fetch to:", url);
    
    const response = await fetch(url);
    console.log("[2] Got response, status:", response.status);
    
    if (!response.ok) {
      console.log("[3] Bad response:", await response.text());
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log("[4] Parsed JSON:", result);
    
    if (!result.data) {
      console.log("[5] Missing data field in response");
      throw new Error("Invalid data format");
    }
    
    console.log("[6] Updating map with", result.data.length, "vehicles");
    updateMap(result.data);
  } catch (err) {
    console.error("[7] Full fetch error:", err);
    setTimeout(fetchData, 10000);
  }
}

// Update map with vehicle data
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
      vehicleTrails[VehicleID] = L.polyline([[Lat, Lng]], { color }).addTo(map);
    } else {
      vehicleTrails[VehicleID].addLatLng([Lat, Lng]);
    }
  });
}

// Initialize
fetchData();
setInterval(fetchData, 5000);