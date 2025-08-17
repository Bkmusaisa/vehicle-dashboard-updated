// Map initialization
const map = L.map('map').setView([11.1523, 7.6548], 14);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// Vehicle data storage
const vehicles = {};

async function fetchData() {
  try {
    const SCRIPT_ID = "AKfycbwp8MJezh9XjFHayC0BlL_MCAn_v2SkV90jmEls-cGrFyfmTtSNx-ZAGxguqC-kg1dV";
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
    
// Vehicle colors configuration (add at top)
const vehicleColors = {
  "Vehicle 1": "blue",
  "Vehicle 2": "green",
  // Add more as needed
};

// Modified updateVehicles function
function updateVehicles(vehicleData) {
  vehicleData.forEach(vehicle => {
    const { VehicleID, Lat, Lng } = vehicle;
    
    // Get color from config or default to red
    const color = vehicleColors[VehicleID] || "red";
    
    if (window.vehicleMarkers[VehicleID]) {
      window.vehicleMarkers[VehicleID]
        .setLatLng([Lat, Lng])
        .setPopupContent(`${VehicleID} (${color})`);
    } else {
      window.vehicleMarkers[VehicleID] = L.circleMarker([Lat, Lng], {
        color: color,
        fillColor: color,
        radius: 8,
        fillOpacity: 0.8
      })
      .bindPopup(`${VehicleID}`)
      .addTo(map);
    }
  });
}
    // Store/update vehicle info
    vehicles[VehicleID] = { Lat, Lng, Speed, Time };
    
    // Update or create marker
    if (!window.vehicleMarkers) window.vehicleMarkers = {};
    if (window.vehicleMarkers[VehicleID]) {
      window.vehicleMarkers[VehicleID]
        .setLatLng([Lat, Lng])
        .setPopupContent(`
          <b>${VehicleID}</b><br>
          Speed: ${Speed || 'N/A'} km/h<br>
          Updated: ${Time || 'N/A'}
        `);
    } else {
      window.vehicleMarkers[VehicleID] = L.marker([Lat, Lng])
        .bindPopup(`
          <b>${VehicleID}</b><br>
          Speed: ${Speed || 'N/A'} km/h<br>
          Updated: ${Time || 'N/A'}
        `)
        .addTo(map);
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
// Add this after map initialization
const senateBuilding = [11.1523, 7.6548]; // ABU Senate coordinates

L.marker(senateBuilding, {
  icon: L.divIcon({
    className: 'admin-marker',
    html: '⬤', // Solid circle
    iconSize: [24, 24]
  })
})
.bindPopup("<b>Ahmadu Bello University</b><br>Senate Building")
.addTo(map);
// Initialize
fetchData();
setInterval(fetchData, 10000); // Update every 10 seconds