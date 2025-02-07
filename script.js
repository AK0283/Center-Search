// Google Sheets API URL (Make sure it's published)
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTc_MQyXRZqZlYwvXUoX7VEyplf7P3KCB2GkHe4LdizIsIRCWj5teCsfZUix-DOVZ7A9BSofjgc7dh3/pub?output=csv";

// Select DOM Elements
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const tableBody = document.getElementById("tableBody");

// Function to Fetch Data from Google Sheets
async function fetchData() {
    try {
        const response = await fetch(SHEET_URL);
        const data = await response.text();

        // Parse CSV Data to JSON
        const rows = data.split("\n").map(row => row.split(","));
        const headers = rows.shift(); // First row as headers

        // Convert to JSON format
        const jsonData = rows.map(row => {
            let obj = {};
            headers.forEach((header, index) => {
                obj[header.trim()] = row[index] ? row[index].trim() : ""; // Trim values
            });
            return obj;
        });

        return jsonData;
    } catch (error) {
        console.error("Error fetching data:", error);
        return [];
    }
}

// Function to Search Data
async function searchData() {
    const query = searchInput.value.trim();
    if (!query) return; // Do nothing if empty

    // Show "Loading" message
    tableBody.innerHTML = `<tr><td colspan="8">Loading, please wait...</td></tr>`;

    // Fetch data from Google Sheets
    const data = await fetchData();

    // Filter results based on search query
    const results = data.filter(row => row["CenterID"] && row["CenterID"].includes(query));

    // Display results
    if (results.length > 0) {
        tableBody.innerHTML = results.map(row => `
            <tr>
                <td>${row["CenterID"] || "-"}</td>
                <td>${row["CenterName"] || "-"}</td>
                <td>${row["ClientID"] || "-"}</td>
                <td>${row["ClientName"] || "-"}</td>
                <td>${row["PhoneNo"] || "-"}</td>
                <td>${row["PAR"] || "-"}</td>
                <td>${row["Inst no (min)"] || "-"}</td>
                <td>${row["Jan"] || "-"}</td>
                <td>${row["Branch Name"] || "-"}</td>
            </tr>
        `).join("");
    } else {
        tableBody.innerHTML = `<tr><td colspan="8">No results found.</td></tr>`;
    }
}

// Event Listeners
searchButton.addEventListener("click", searchData);
searchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") searchData();
});

// Fetch data on page load
fetchData();
