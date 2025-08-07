
// Constants
const CENTER_LAT = 11.0631;
const CENTER_LNG = 7.7070;
const GEOFENCE_RADIUS = 10000; // 10 km
const ADMIN_PHONE = "08097591477";

// Initialize the map
const map = L.map('map').setView([CENTER_LAT, CENTER_LNG], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
}).addTo(map);

// Show admin location as a black dot
L.circleMarker([CENTER_LAT, CENTER_LNG], {
  radius: 6,
  color: 'black',
  fillColor: 'black',
  fillOpacity: 1
}).addTo(map).bindPopup("Admin Location");

// Dummy vehicle data simulation (Replace with live fetch logic)
const vehicles = [
  { id: "Vehicle 1", lat: 11.0700, lng: 7.7100, speed: 45, time: "12:34", status: "OK", color: "blue" },
  { id: "Vehicle 2", lat: 11.0680, lng: 7.7150, speed: 52, time: "12:36", status: "OK", color: "green" }
];

vehicles.forEach(vehicle => {
  const marker = L.circleMarker([vehicle.lat, vehicle.lng], {
    color: vehicle.color,
    radius: 8,
    fillOpacity: 0.7
  }).addTo(map).bindPopup(vehicle.id);

  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${vehicle.id}</td>
    <td>${vehicle.speed} km/h</td>
    <td>${vehicle.time}</td>
    <td>${vehicle.status}</td>
  `;
  document.querySelector("#vehicle-status tbody").appendChild(row);
});

function sendOverride(state) {
  alert("Sending override " + state + " command...");
  // Implement SMS/POST logic here
}
