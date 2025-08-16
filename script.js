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
    const url = `${sheetURL}?t=${Date.now()}`; // Cache buster
    console.log("Fetching:", url);
    
    const response = await fetch(url);
    
    // Handle non-200 responses
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    // Validate response structure
    if (!result.data) {
      throw new Error("Invalid data format");
    }
    
    updateMap(result.data);
  } catch (err) {
    console.error("Fetch error:", err);
    setTimeout(fetchData, 10000); // Retry after 10s
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