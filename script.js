const sheetURL = "https://script.google.com/macros/s/AKfycbysU13girZLgY8xfApAlvCeF-uyDoIDvGPZZxiRdBfy5y4NDNj8wyMlJLpqcO57GWl4/exec"; // No extra https://

async function fetchData() {
    try {
        const response = await fetch(sheetURL);
        const data = await response.json(); // Parse JSON directly

        if (!Array.isArray(data)) {
            console.error("Invalid JSON format:", data);
            return;
        }

        console.log("Fetched data:", data);
        // You can now pass `data` to your map/table update function
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

fetchData();
