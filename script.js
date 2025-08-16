// Configuration
const url = `https://script.google.com/macros/s/AKfycbwrGelGMLzOhq0EopHZLRJlPtROj_BaF9XivCXmcqwKopD3TC3Tz2RpvGRnjQe1k9uD/exec?t=${Date.now()}`;
const proxyUrl = `https://cors-anywhere.herokuapp.com/${url}`;

// Use proxyUrl instead of url in fetch()
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
    // Add /dev to the URL to prevent redirects
    const url = `${sheetURL.replace('/exec', '/dev')}?t=${Date.now()}`;
    console.log("Fetching:", https://script.google.com/macros/s/AKfycbwrGelGMLzOhq0EopHZLRJlPtROj_BaF9XivCXmcqwKopD3TC3Tz2RpvGRnjQe1k9uD/exec);
    
    const response = await fetch(url, {
      redirect: 'follow', // Explicitly follow redirects
      credentials: 'omit' // Important for CORS
    });
    
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    
    const data = await response.json();
    if (!data?.data) throw new Error("Invalid data format");
    
    updateMap(data.data);
  } catch (err) {
    console.error("Fetch error (retrying in 5s):", err);
    setTimeout(fetchData, 5000);
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

