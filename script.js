const SHEET_ID = "1vtX0NSGh18XpAZlx1m6m3FnWs02KmalKYcDdXfWYvbU"; // Replace with actual Sheet ID
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

// Function to fetch and display data
async function fetchData() {
    try {
        document.getElementById("result").innerHTML = "Loading, please wait...";

        const response = await fetch(SHEET_URL);
        const text = await response.text();

        // Parse JSON (Google Sheets returns wrapped data)
        const json = JSON.parse(text.substring(47, text.length - 2));
        const rows = json.table.rows;

        // Extract headers
        const headers = json.table.cols.map(col => col.label);

        // Clear table before adding new data
        const table = document.getElementById("dataTable");
        table.innerHTML = "";

        // Create header row
        const headerRow = document.createElement("tr");
        headers.forEach(header => {
            const th = document.createElement("th");
            th.textContent = header;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        // Add rows to table
        rows.forEach(row => {
            const tr = document.createElement("tr");
            row.c.forEach(cell => {
                const td = document.createElement("td");
                td.textContent = cell ? cell.v : ""; // Handle empty cells
                tr.appendChild(td);
            });
            table.appendChild(tr);
        });

        document.getElementById("result").innerHTML = ""; // Clear loading message

    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById("result").innerHTML = "Error loading data.";
    }
}

// Function to search data based on Center ID
function searchData() {
    const searchInput = document.getElementById("searchInput").value.trim();
    if (!searchInput) {
        alert("Please enter a Center ID");
        return;
    }

    // Fetch data and filter based on search query
    fetchData().then(() => {
        const table = document.getElementById("dataTable");
        const rows = table.getElementsByTagName("tr");
        for (let i = 1; i < rows.length; i++) { // Skip header row
            const cells = rows[i].getElementsByTagName("td");
            const centerID = cells[0].textContent || cells[0].innerText;
            if (centerID === searchInput) {
                rows[i].style.display = ""; // Show matching row
            } else {
                rows[i].style.display = "none"; // Hide non-matching rows
            }
        }
    });
}