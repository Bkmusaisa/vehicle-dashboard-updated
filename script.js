// Configuration
const SCRIPT_ID = "AKfycbwp8MJezh9XjFHayC0BlL_MCAn_v2SkV90jmEls-cGrFyfmTtSNx-ZAGxguqC-kg1dV";
const ADMIN_LAT = 11.1523;
const ADMIN_LNG = 7.6548;

// URL Configuration (using your new URL)
const PROD_URL = `https://script.google.com/macros/s/${SCRIPT_ID}/exec`;
const DEV_URL = PROD_URL.replace('/exec', '/dev');

const vehicleColors = {
  "Vehicle 1": "blue",
  "Vehicle 2": "green",
  "Vehicle 3": "red",
  "Vehicle 4": "orange",
  "Vehicle 5": "purple"
};

// Map Initialization
const map = L.map("map").setView([ADMIN_LAT, ADMIN_LNG], 14);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Admin Marker
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

// Enhanced Fetch Function with 3 Fallback Methods
async function fetchData() {
  const attempts = [
    { url: DEV_URL, options: { redirect: 'follow', credentials: 'omit' } },
    { url: PROD_URL, options: { redirect: 'follow', credentials: 'omit' } },
    { url: `https://cors-anywhere.herokuapp.com/${PROD_URL}`, options: {} }
  ];

  for (const attempt of attempts) {
    try {
      const url = `${attempt.url}?t=${Date.now()}`;
      console.log("Attempting fetch from:", url);
      
      const response = await fetch(url, attempt.options);
      
      if (!response.ok) continue;
      
      const result = await response.json();
      if (!result?.data) continue;
      
      console.log("Data received from", url);
      updateMap(result.data);
      return; // Success - exit the function
      
    } catch (error) {
      console.warn(`Attempt failed: ${error.message}`);
    }
  }
  
  console.error("All fetch attempts failed. Retrying in 10s...");
  setTimeout(fetchData, 10000);
}

// Optimized Map Update Function
function updateMap(vehicles) {
  vehicles.forEach(vehicle => {
    const { VehicleID, Lat, Lng, Time, Speed } = vehicle;
    if (typeof Lat !== 'number' || typeof Lng !== 'number') return;

    const color = vehicleColors[VehicleID] || "gray";
    const popupContent = `
      <b>${VehicleID}</b><br>
      ${Time ? `Time: ${Time}<br>` : ''}
      Location: ${Lat.toFixed(6)}, ${Lng.toFixed(6)}<br>
      ${Speed ? `Speed: ${Speed} km/h` : ''}
    `;

    // Update or create marker
    if (vehicleMarkers[VehicleID]) {
      vehicleMarkers[VehicleID]
        .setLatLng([Lat, Lng])
        .setPopupContent(popupContent);
    } else {
      vehicleMarkers[VehicleID] = L.circleMarker([Lat, Lng], {
        color: color,
        radius: 8,
        fillOpacity: 0.8
      }).bindPopup(popupContent).addTo(map);
    }

    // Update or create trail
    if (!vehicleTrails[VehicleID]) {
      vehicleTrails[VehicleID] = L.polyline([[Lat, Lng]], {
        color: color,
        weight: 3
      }).addTo(map);
    } else {
      vehicleTrails[VehicleID].addLatLng([Lat, Lng]);
    }
  });
}

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
  fetchData();
  setInterval(fetchData, 15000); // Refresh every 15 seconds
});