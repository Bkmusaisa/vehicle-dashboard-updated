// 1. CONSTANTS
const SCRIPT_ID = "AKfycbwp8MJezh9XjFHayC0BlL_MCAn_v2SkV90jmEls-cGrFyfmTtSNx-ZAGxguqC-kg1dV";
const senateBuilding = [11.1523, 7.6548]; // ABU Senate coordinates
const vehicleColors = {
  "Vehicle 1": "blue",
  "Vehicle 2": "green",
  "Vehicle 3": "red",
  "Vehicle 4": "orange",
  "Vehicle 5": "purple"
};

// 2. MAP INITIALIZATION
const map = L.map('map').setView(senateBuilding, 14);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
// 3. ADMIN MARKER
L.marker(senateBuilding, {
  icon: L.divIcon({
    className: 'admin-marker',
    html: '⬤',
    iconSize: [24, 24]
  })
}).bindPopup("<b>Ahmadu Bello University</b><br>Senate Building").addTo(map);

// 4. VEHICLE TRACKING
const vehicleMarkers = {};
const vehicleTrails = {};
const vehicles = {}; // For table data

// 5. FUNCTIONS
async function fetchData() {
  try {
    const response = await fetch(
      `https://script.google.com/macros/s/${SCRIPT_ID}/exec?t=${Date.now()}`
    );
    const { data } = await response.json();
    updateVehicles(data);
    updateTable();
  } catch (error) {
    console.error("Fetch error:", error);
    setTimeout(fetchData, 5000);
  }
}

function updateVehicles(vehicleData) {
  vehicleData.forEach(vehicle => {
    const { VehicleID, Lat, Lng, Speed, Time } = vehicle;
    const position = [Lat, Lng];
    const color = vehicleColors[VehicleID] || "gray";

    // Store for table
    vehicles[VehicleID] = { Speed, Time };

    // Update marker
    if (vehicleMarkers[VehicleID]) {
      vehicleMarkers[VehicleID]
        .setLatLng(position)
        .setPopupContent(`
          <b>${VehicleID}</b><br>
          Speed: ${Speed || 'N/A'} km/h<br>
          Time: ${Time || 'N/A'}
        `);
    } else {
      vehicleMarkers[VehicleID] = L.circleMarker(position, {
        color: color,
        fillColor: color,
        radius: 8,
        fillOpacity: 0.8
      }).bindPopup(VehicleID).addTo(map);
    }

    // Update trail
    if (!vehicleTrails[VehicleID]) {
      vehicleTrails[VehicleID] = L.polyline([position], {
        color: color,
        weight: 3
      }).addTo(map);
    } else {
      vehicleTrails[VehicleID].addLatLng(position);
    }
  });
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

// 6. START SYSTEM
fetchData();
setInterval(fetchData, 10000);