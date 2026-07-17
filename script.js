// 1. Paste your published Google Sheet CSV link here
const sheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTGgnH9NrNQ-CR_KN4aK3HM66dasJ3jxpoRPGXaBDfwUdZ71IqAqVB5q3LV8qqFqLiSUwVrS0fdw1nj/pub?output=csv';

const searchInput = document.getElementById('searchInput');
const resultsGrid = document.getElementById('resultsGrid');
let inventory = []; // This starts empty, we will fill it from the Google Sheet

// 2. Fetch the data from Google Sheets
async function loadInventory() {
    try {
        const response = await fetch(sheetURL);
        const data = await response.text();
        
        // Convert the CSV text into a JavaScript Array
        inventory = parseCSV(data);
        
        // Show the items on the screen
        displayItems(inventory);
    } catch (error) {
        resultsGrid.innerHTML = `<p style="text-align: center; color: red;">Failed to load inventory. Please check your internet connection.</p>`;
    }
}

// 3. Simple function to turn CSV text into a usable Array
function parseCSV(csvText) {
    const rows = csvText.split('\n');
    const items = [];
    
    // Start at i = 1 to skip the header row (Name, Category, Description)
    for (let i = 1; i < rows.length; i++) {
        // Split by comma, but handle potential empty lines
        if (rows[i].trim() === '') continue;
        
        // Basic split (Note: avoid using commas inside your descriptions in the Google Sheet)
        const columns = rows[i].split(','); 
        
        items.push({
            name: columns[0] ? columns[0].trim() : '',
            category: columns[1] ? columns[1].trim() : '',
            desc: columns[2] ? columns[2].trim() : ''
        });
    }
    return items;
}

// 4. Function to display the items on the screen (Same as before)
function displayItems(items) {
    resultsGrid.innerHTML = '';

    if (items.length === 0) {
        resultsGrid.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; color: #e67e22; font-weight: bold;">Item not found. Call the shop to check custom orders!</p>`;
        return;
    }

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card'; 
        card.innerHTML = `
            <span style="font-size: 0.8rem; color: #888; text-transform: uppercase;">${item.category}</span>
            <h3 style="margin: 5px 0 10px 0;">${item.name}</h3>
            <p>${item.desc}</p>
        `;
        resultsGrid.appendChild(card);
    });
}

// 5. Listen for the user typing in the search box
searchInput.addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    
    const filteredItems = inventory.filter(item => 
        item.name.toLowerCase().includes(searchTerm) || 
        item.category.toLowerCase().includes(searchTerm)
    );
    
    displayItems(filteredItems);
});

// 6. Start the process when the script loads
loadInventory();