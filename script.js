const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTc_MQyXRZqZlYwvXUoX7VEyplf7P3KCB2GkHe4LdizIsIRCWj5teCsfZUix-DOVZ7A9BSofjgc7dh3/pub?output=csv";

document.getElementById("searchButton").addEventListener("click", searchData);

async function fetchData() {
    try {
        const response = await fetch(SHEET_URL);
        const data = await response.text();
        return parseCSV(data);
    } catch (error) {
        console.error("Error fetching data:", error);
        return [];
    }
}

function parseCSV(csvText) {
    const rows = csvText.split("\n").map(row => row.split(","));
    const headers = rows.shift(); // Remove and store headers
    return rows.map(row => {
        let obj = {};
        headers.forEach((header, index) => {
            obj[header.trim()] = row[index] ? row[index].trim() : "";
        });
        return obj;
    });
}

async function searchData() {
    const searchInput = document.getElementById("searchInput").value.trim();
    const tableBody = document.getElementById("tableBody");

    if (!tableBody) {
        console.error("Error: Table body (tableBody) not found!");
        return;
    }

    tableBody.innerHTML = "<tr><td colspan='9'>Loading, please wait...</td></tr>";

    const data = await fetchData();

    if (!searchInput) {
        tableBody.innerHTML = "<tr><td colspan='9'>Please enter a Center ID.</td></tr>";
        return;
    }

    const filteredData = data.filter(row => row["CenterID"] === searchInput);

    if (filteredData.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='9'>No results found.</td></tr>";
        return;
    }

    tableBody.innerHTML = "";
    filteredData.forEach(row => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${row["CenterID"]}</td>
            <td>${row["CenterName"]}</td>
            <td>${row["ClientID"]}</td>
            <td>${row["ClientName"]}</td>
            <td>${row["PhoneNo"]}</td>
            <td>${row["PAR"]}</td>
            <td>${row["Inst no (min)"]}</td>
            <td>${row["Jan"]}</td>
            <td>${row["Branch Name"]}</td>
        `;
        tableBody.appendChild(tr);
    });
}
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/Center-Search/sw.js")
    .then(() => console.log("Service Worker Registered"))
    .catch((error) => console.log("Service Worker Failed", error));
}
