// Configuration
const sheetURL = "https://script.google.com/macros/s/AKfycbz9O7LzggJdHaJUko9Qn_CUr07iVFfmd6NMM-ylAgSy1NzHFgzc8DbruQcX1hMgZ_vJ/exec";
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

// Fetch data from Google Sheets
async function fetchData() {
  try {
    const url = `${sheetURL}?t=${Date.now()}`;
    const response = await fetch(url, { 
      cache: 'no-store',
      mode: 'no-cors'
    });
    
    const data = await response.json();
    const vehicles = Array.isArray(data) ? data : data.data;
    updateMap(vehicles);
  } catch (err) {
    console.error("Error fetching data:", err);
    setTimeout(fetchData, 10000);
  }
}

// Single, corrected updateMap function
function updateMap(data) {
  data.forEach(vehicle => {
    const { VehicleID, Lat, Lng, Time } = vehicle;
    if (!Lat || !Lng) return;

    const color = vehicleColors[VehicleID] || "black";
    const popupContent = `${VehicleID}<br>Time: ${Time || "N/A"}`;

    // Update or create marker
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

    // Update or create trail
    if (!vehicleTrails[VehicleID]) {
      vehicleTrails[VehicleID] = L.polyline([[Lat, Lng]], { color: color }).addTo(map);
    } else {
      vehicleTrails[VehicleID].addLatLng([Lat, Lng]);
    }
  });
}

// Start the system
fetchData();
setInterval(fetchData, 5000);