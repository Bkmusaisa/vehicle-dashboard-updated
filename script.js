const map = L.map('map').setView([11.1562, 7.6545], 14); // ABU Zaria center
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let markers = {};

async function fetchData() {
  try {
    const url = "https://script.google.com/macros/s/https://script.google.com/macros/s/AKfycbyrlaVN9gYv2OrSr6aRPaXla4A4DFWSjhsOk4UUyyVWUTsp8q4lMayI_FmAh3l13-yp/exec"; // Replace with your Web App URL
    const response = await fetch(url, { mode: "no-cors" });
    const text = await response.text();
    
    // Extract JSON from HTML body
    const jsonMatch = text.match(/\[.*\]/);
    if (jsonMatch) {
      const data = JSON.parse(jsonMatch[0]);
      console.log("Fetched data:", data);
      updateMap(data);
    } else {
      console.error("No JSON found in response");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function updateMap(data) {
  // Your existing map update code
}

setInterval(fetchData, 5000);
fetchData();


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
