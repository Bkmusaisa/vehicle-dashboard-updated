// ==============================
// Vehicle Tracking Dashboard
// ==============================
// Google Apps Script Web App endpoint
const SHEET_API_URL = "https://script.google.com/macros/s/AKfycbwjkCojy5aXeVd6avWQybZgmQTt1sS9JNaUY60A9CW8AnNeiF1UWZzis9y1zvkOJ6v4/exec";

// Store vehicle markers, trails, and colors
let vehicles = {};
let vehicleMarkers = {};
let vehicleTrails = {};
let vehicleColors = {};

// Map setup
const map = L.map("map").setView([11.1536, 7.6544], 13); // ABU Zaria coords

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

// Admin center + geofence
const adminLat = 11.1536;
const adminLng = 7.6544;
const geofenceRadius = 10000; // 10 km in meters

L.circle([adminLat, adminLng], {
  radius: geofenceRadius,
  color: "red",
  fillOpacity: 0.05,
}).addTo(map);

L.circleMarker([adminLat, adminLng], {
  radius: 6,
  color: "black",
  fillColor: "black",
  fillOpacity: 1,
}).addTo(map);

// Random color generator
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Fetch vehicle data from Google Sheets
async function fetchData() {
  try {
    const response = await fetch(SHEET_API_URL);
    if (!response.ok) throw new Error("Network response was not ok");
    const result = await response.json();
    console.log("First row:", data.data[0]);
    // process your result.data here
  } catch (err) {
    console.error("Fetch error:", err);
  }
}


// Update markers, trails, and status
function updateMap(vehicleList) {
  vehicleList.forEach((vehicle) => {
    const { VehicleID, Lat, Lng, Speed, Time } = vehicle;

    if (!Lat || !Lng) return;

    // Assign color if new vehicle
    if (!vehicleColors[VehicleID]) {
      if (VehicleID === "Vehicle1") {
        vehicleColors[VehicleID] = "blue";
      } else if (VehicleID === "Vehicle2") {
        vehicleColors[VehicleID] = "green";
      } else {
        vehicleColors[VehicleID] = getRandomColor();
      }
    }
    const color = vehicleColors[VehicleID];

    // Update marker
    if (vehicleMarkers[VehicleID]) {
      vehicleMarkers[VehicleID].setLatLng([Lat, Lng]);
    } else {
      vehicleMarkers[VehicleID] = L.marker([Lat, Lng], {
        icon: L.icon({
          iconUrl: `https://via.placeholder.com/30/${color.slice(1)}/ffffff?text=●`,
          iconSize: [24, 24],
        }),
      })
        .addTo(map)
        .bindPopup(`${VehicleID}<br>Speed: ${Speed} km/h`);
    }

    // Save last data
    vehicles[VehicleID] = { Lat, Lng, Speed, Time };

    // Redraw trail
    if (vehicleTrails[VehicleID]) {
      map.removeLayer(vehicleTrails[VehicleID]);
    }

    const history = vehicleList
      .filter((v) => v.VehicleID === VehicleID && v.Lat && v.Lng)
      .sort((a, b) => new Date(a.Time) - new Date(b.Time))
      .map((v) => [v.Lat, v.Lng]);

    vehicleTrails[VehicleID] = L.polyline(history, {
      color: color,
      weight: 3,
    }).addTo(map);
  });
}

// Update status table
function updateTable() {
  const tableBody = document.getElementById("vehicle-data");
  tableBody.innerHTML = "";

  Object.entries(vehicles).forEach(([id, data]) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${id}</td>
      <td>${data.Speed || "N/A"} km/h</td>
      <td>${data.Time || "N/A"}</td>
    `;
    tableBody.appendChild(row);
  });
}

// Start updates
fetchData();
setInterval(fetchData, 10000);
