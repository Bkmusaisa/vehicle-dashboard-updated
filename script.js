const map = L.map('map').setView([11.1562, 7.6545], 14); // ABU Zaria center
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let markers = {};

async function fetchData() {
    const url = "https://script.google.com/macros/s/AKfycbwoQx-qbNPQS9h4sibvu_8MZDUbIVpW7qI_gcb_eIc/dev?nocache=" + new Date().getTime();
    const res = await fetch(url);
    const data = await res.json();
    updateMap(data);
    updateTable(data);
}

function updateMap(data) {
    Object.values(markers).forEach(marker => map.removeLayer(marker));
    markers = {};
    data.forEach(vehicle => {
        const marker = L.marker([vehicle.lat, vehicle.lng]).addTo(map)
            .bindPopup(`<b>${vehicle.name}</b><br>Speed: ${vehicle.speed} km/h`);
        markers[vehicle.name] = marker;
    });
}

function updateTable(data) {
    const tbody = document.querySelector('#status-table tbody');
    tbody.innerHTML = '';
    data.forEach(vehicle => {
        tbody.innerHTML += `
            <tr>
                <td>${vehicle.name}</td>
                <td>${vehicle.speed}</td>
                <td>${vehicle.lat.toFixed(4)}, ${vehicle.lng.toFixed(4)}</td>
                <td>${vehicle.time}</td>
            </tr>
        `;
    });
}

setInterval(fetchData, 5000);
fetchData();
