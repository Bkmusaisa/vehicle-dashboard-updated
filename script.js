// 1. Initialize Map
const map = L.map('map').setView([11.1523, 7.6548], 14);

// 2. Add Map Tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap'
}).addTo(map);

// 3. Add Admin Marker
L.marker([11.1523, 7.6548])
  .bindPopup("<b>ABU Senate Building</b>")
  .addTo(map);

// 4. Vehicle Tracking
const vehicleMarkers = {};

async function fetchData() {
  try {
    const SCRIPT_ID = "AKfycbwp8MJezh9XjFHayC0BlL_MCAn_v2SkV90jmEls-cGrFyfmTtSNx-ZAGxguqC-kg1dV";
    const response = await fetch(
      `https://script.google.com/macros/s/${SCRIPT_ID}/exec?t=${Date.now()}`
    );
    
    const { data } = await response.json();
    updateVehicles(data);
  } catch (error) {
    console.error("Fetch error:", error);
    setTimeout(fetchData, 5000);
  }
}

function updateVehicles(vehicles) {
  // Clear old markers
  Object.values(vehicleMarkers).forEach(marker => map.removeLayer(marker));

  // Add new markers
  vehicles.forEach(vehicle => {
    const { VehicleID, Lat, Lng } = vehicle;
    vehicleMarkers[VehicleID] = L.marker([Lat, Lng])
      .bindPopup(`<b>${VehicleID}</b>`)
      .addTo(map);
  });
}

// 5. Start the system
fetchData();
setInterval(fetchData, 10000); // Update every 10 seconds