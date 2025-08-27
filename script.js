// 1. CONSTANTS
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyuIJQXEzFT3RZgSrgB3mVDDWHqD347SIXGqUjtdC2cFG0rdN4wjL7hUELEqwFqlej5/exec";

const senateBuilding = [11.1523, 7.6548]; // ABU Senate coordinates

const vehicleColors = {
  "Vehicle 1": "blue",
  "Vehicle 2": "green",
  "Vehicle 3": "red",
  "Vehicle 4": "orange",
  "Vehicle 5": "purple"
};

// MAP INITIALIZATION
const map = L.map('map').setView(senateBuilding, 14);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// ADMIN LOCATION (Black Dot)
L.circleMarker(senateBuilding, {
  color: "black",
  fillColor: "black",
  radius: 10,
  fillOpacity: 1
}).bindPopup("Admin Location (Senate Building)").addTo(map);

// VEHICLE TRACKING
const vehicleMarkers = {};
const vehicleTrails = {};
const vehicles = {}; // For table data

// FUNCTIONS
async function fetchData() {
  try {
    const response = await fetch(
      `https://script.google.com/macros/s/AKfycbyuIJQXEzFT3RZgSrgB3mVDDWHqD347SIXGqUjtdC2cFG0rdN4wjL7hUELEqwFqlej5/exec?t=${Date.now()}`
    );
    const { data } = await response.json();
    updateVehicles(data);
    updateTable();
  } catch (error) {
    console.error("Fetch error:", error);
    setTimeout(fetchData, 5000);
  }
}

function updateVehicles(vehicleList) {
  vehicleList.forEach(vehicle => {
    const { VehicleID, Lat, Lng } = vehicle;
    const position = [Lat, Lng];
    
    console.log(`Processing: ${VehicleID}`); 
    
    const color = vehicleColors[VehicleID?.trim()] || "red"; 
    
    // Create/update marker
    if (vehicleMarkers[VehicleID]) {
      vehicleMarkers[VehicleID]
        .setLatLng(position)
        .setPopupContent(`${VehicleID}`);
    } else {
      vehicleMarkers[VehicleID] = L.circleMarker(position, {
        color: color,
        fillColor: color,
        radius: 8,
        fillOpacity: 0.8
      }).bindPopup(VehicleID).addTo(map);
    }

// Reset and redraw vehicle trail each update
if (vehicleTrails[VehicleID]) {
  map.removeLayer(vehicleTrails[VehicleID]); // remove old trail
}

// Build new trail from all history rows of this vehicle
const history = vehicleList
  .filter(v => v.VehicleID === VehicleID && v.Lat && v.Lng)
  .sort((a, b) => new Date(a.Time) - new Date(b.Time)) // sort by timestamp
  .map(v => [v.Lat, v.Lng]);

vehicleTrails[VehicleID] = L.polyline(history, {
  color: color,
  weight: 3
}).addTo(map);
}

function updateTable() {
  const tableBody = document.getElementById('vehicle-data');
  tableBody.innerHTML = '';
  
  Object.entries(vehicles).forEach(([id, data]) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${id}</td>
      <td>${data.Speed || 'N/A'} km/h</td>
      <td>${data.Time || 'N/A'}</td>
    `;
    tableBody.appendChild(row);
  });
}

// START SYSTEM
fetchData();
setInterval(fetchData, 10000);
