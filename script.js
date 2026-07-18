// 1. Paste your published Google Sheet CSV link here
const sheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTGgnH9NrNQ-CR_KN4aK3HM66dasJ3jxpoRPGXaBDfwUdZ71IqAqVB5q3LV8qqFqLiSUwVrS0fdw1nj/pub?output=csv';

const searchInput = document.getElementById('searchInput');
const resultsGrid = document.getElementById('resultsGrid');
let inventory = []; 

// 2. Fetch the data from Google Sheets
async function loadInventory() {
    try {
        const response = await fetch(sheetURL);
        const data = await response.text();
        
        inventory = parseCSV(data);
        displayItems(inventory);
    } catch (error) {
        resultsGrid.innerHTML = `<p style="text-align: center; color: red;">Failed to load inventory. Please check your internet connection.</p>`;
    }
}

// 3. Simple function to turn CSV text into a usable Array
function parseCSV(csvText) {
    const rows = csvText.split('\n');
    const items = [];
    
    for (let i = 1; i < rows.length; i++) {
        // Skip totally empty lines
        if (rows[i].trim() === '') continue;
        
        const columns = rows[i].split(','); 
        const name = columns[0] ? columns[0].trim() : '';
        
        // THE FIX: If there is no product name, skip this row!
        if (!name) continue; 
        
        // A checked box in Sheets becomes "TRUE". Unchecked becomes "FALSE".
        const rawStatus = columns[3] ? columns[3].trim().toUpperCase() : 'FALSE';
        const stockText = (rawStatus === 'TRUE') ? 'In Stock' : 'Out of Stock';
        
        items.push({
            name: name,
            category: columns[1] ? columns[1].trim() : '',
            desc: columns[2] ? columns[2].trim() : '',
            status: stockText 
        });
    }
    return items;
}

// 4. Function to display the items on the screen
function displayItems(items) {
    resultsGrid.innerHTML = '';

    if (items.length === 0) {
        resultsGrid.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; color: #e67e22; font-weight: bold;">Item not found. Call the shop to check custom orders!</p>`;
        return;
    }

    items.forEach(item => {
        // Now it just looks at the perfectly spelled text we generated above
        const statusClass = (item.status === 'Out of Stock') ? 'out-of-stock' : 'in-stock';

        const card = document.createElement('div');
        card.className = 'card'; 
        
        card.innerHTML = `
            <span style="font-size: 0.8rem; color: #888; text-transform: uppercase;">${item.category}</span>
            <span class="status-badge ${statusClass}">${item.status}</span>
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
// --- Dark Mode Logic ---
const darkModeToggle = document.getElementById('darkModeToggle');

// 1. Check if the user already chose dark mode in a previous visit
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-theme');
    darkModeToggle.textContent = '☀️ Light Mode';
}

// 2. Listen for clicks on the toggle button
darkModeToggle.addEventListener('click', () => {
    // Toggle the class on the body element
    document.body.classList.toggle('dark-theme');
    
    // 3. Update the button text and save preference
    if (document.body.classList.contains('dark-theme')) {
        localStorage.setItem('theme', 'dark');
        darkModeToggle.textContent = '☀️ Light Mode';
    } else {
        localStorage.setItem('theme', 'light');
        darkModeToggle.textContent = '🌙 Dark Mode';
    }
});
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('scroll-show');
    }
  });
});

// Grab all elements with the class and observe them
document.querySelectorAll('.scroll-hidden').forEach((el) => observer.observe(el));