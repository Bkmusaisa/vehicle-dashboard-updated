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

// Initialize
fetchData();
setInterval(fetchData, 10000); // Update every 10 seconds