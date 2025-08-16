const sheetURL = "const sheetURL = "const sheetURL = "https://script.google.com/macros/s/AKfycbxkaXTjaq8lSqnOqBSrOxc9QASZQDQDhKaFSHlKHu4ay91OReQGGP2bzYtGm183iac/exec";
const ADMIN_LAT = 11.1523;
const ADMIN_LNG = 7.6548;

const vehicleColors = {
  "Vehicle 1": "blue",
  "Vehicle 2": "green",
  "Vehicle 3": "red",
  "Vehicle 4": "orange",
  "Vehicle 5": "purple"
};

let map = L.map("map").setView([ADMIN_LAT, ADMIN_LNG], 14);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19
}).addTo(map);

L.marker([ADMIN_LAT, ADMIN_LNG], { icon: L.divIcon({ className: 'admin-marker', html: '⬤', iconSize: [20, 20] }) })
  .bindPopup("Admin Location - ABU Senate Building")
  .addTo(map);

let vehicleMarkers = {};
let vehicleTrails = {};

async function fetchData() {
  try {
    const response = await fetch(sheetURL, { cache: "no-cache" });
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);

    const data = await response.json();
    if (!Array.isArray(data)) return console.error("Invalid data format");

    updateMap(data);
  } catch (err) {
    console.error("Error fetching data:", err);
  }
}

function updateMap(data) {
  data.forEach(vehicle => {
    const { VehicleID, Lat, Lng } = vehicle;
    if (!Lat || !Lng) return;

    const color = vehicleColors[VehicleID] || "black";

    // Update marker
    if (vehicleMarkers[VehicleID]) {
      vehicleMarkers[VehicleID].setLatLng([Lat, Lng]);
    } else {
      vehicleMarkers[VehicleID] = L.circleMarker([Lat, Lng], {
        color: color,
        radius: 8
      }).addTo(map).bindPopup(VehicleID);
    }

    // Update trail
    if (!vehicleTrails[VehicleID]) {
      vehicleTrails[VehicleID] = L.polyline([[Lat, Lng]], { color: color }).addTo(map);
    } else {
      vehicleTrails[VehicleID].addLatLng([Lat, Lng]);
    }
  });
}

setInterval(fetchData, 5000);
";
const ADMIN_LAT = 11.1523;
const ADMIN_LNG = 7.6548;

const vehicleColors = {
  "Vehicle 1": "blue",
  "Vehicle 2": "green",
  "Vehicle 3": "red",
  "Vehicle 4": "orange",
  "Vehicle 5": "purple"
};

let map = L.map("map").setView([ADMIN_LAT, ADMIN_LNG], 14);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19
}).addTo(map);

L.marker([ADMIN_LAT, ADMIN_LNG], { icon: L.divIcon({ className: 'admin-marker', html: '⬤', iconSize: [20, 20] }) })
  .bindPopup("Admin Location - ABU Senate Building")
  .addTo(map);

let vehicleMarkers = {};
let vehicleTrails = {};

async function fetchData() {
  try {
    const response = await fetch(sheetURL, { cache: "no-cache" });
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);

    const data = await response.json();
    if (!Array.isArray(data)) return console.error("Invalid data format");

    updateMap(data);
  } catch (err) {
    console.error("Error fetching data:", err);
  }
}

function updateMap(data) {
  data.forEach(vehicle => {
    const { VehicleID, Lat, Lng } = vehicle;
    if (!Lat || !Lng) return;

    const color = vehicleColors[VehicleID] || "black";

    // Update marker
    if (vehicleMarkers[VehicleID]) {
      vehicleMarkers[VehicleID].setLatLng([Lat, Lng]);
    } else {
      vehicleMarkers[VehicleID] = L.circleMarker([Lat, Lng], {
        color: color,
        radius: 8
      }).addTo(map).bindPopup(VehicleID);
    }

    // Update trail
    if (!vehicleTrails[VehicleID]) {
      vehicleTrails[VehicleID] = L.polyline([[Lat, Lng]], { color: color }).addTo(map);
    } else {
      vehicleTrails[VehicleID].addLatLng([Lat, Lng]);
    }
  });
}

setInterval(fetchData, 5000);
";
const ADMIN_LAT = 11.1523;
const ADMIN_LNG = 7.6548;

const vehicleColors = {
  "Vehicle 1": "blue",
  "Vehicle 2": "green",
  "Vehicle 3": "red",
  "Vehicle 4": "orange",
  "Vehicle 5": "purple"
};

let map = L.map("map").setView([ADMIN_LAT, ADMIN_LNG], 14);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19
}).addTo(map);

L.marker([ADMIN_LAT, ADMIN_LNG], { icon: L.divIcon({ className: 'admin-marker', html: '⬤', iconSize: [20, 20] }) })
  .bindPopup("Admin Location - ABU Senate Building")
  .addTo(map);

let vehicleMarkers = {};
let vehicleTrails = {};

async function fetchData() {
  try {
    const response = await fetch(sheetURL, { cache: "no-cache" });
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);

    const data = await response.json();
    if (!Array.isArray(data)) return console.error("Invalid data format");

    updateMap(data);
  } catch (err) {
    console.error("Error fetching data:", err);
  }
}

function updateMap(data) {
  data.forEach(vehicle => {
    const { VehicleID, Lat, Lng } = vehicle;
    if (!Lat || !Lng) return;

    const color = vehicleColors[VehicleID] || "black";

    // Update marker
    if (vehicleMarkers[VehicleID]) {
      vehicleMarkers[VehicleID].setLatLng([Lat, Lng]);
    } else {
      vehicleMarkers[VehicleID] = L.circleMarker([Lat, Lng], {
        color: color,
        radius: 8
      }).addTo(map).bindPopup(VehicleID);
    }

    // Update trail
    if (!vehicleTrails[VehicleID]) {
      vehicleTrails[VehicleID] = L.polyline([[Lat, Lng]], { color: color }).addTo(map);
    } else {
      vehicleTrails[VehicleID].addLatLng([Lat, Lng]);
    }
  });
}

setInterval(fetchData, 5000);
