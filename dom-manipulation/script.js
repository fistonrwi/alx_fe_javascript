// Quotes array
let quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration" },
  { text: "The purpose of our lives is to be happy.", category: "Happiness" },
  // Add more quotes as needed
];

// Function to display a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  // Clear the current quote
  quoteDisplay.innerHTML = "";

  // Create new elements for the quote
  const quoteText = document.createElement("p");
  quoteText.textContent = randomQuote.text;

  const quoteCategory = document.createElement("em");
  quoteCategory.textContent = ` - ${randomQuote.category}`;

  // Append the new elements to the quote display
  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(quoteCategory);
}

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;

  if (newQuoteText && newQuoteCategory) {
    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);
    saveQuotes();
    updateCategoryFilter();
    alert("Quote added successfully!");
  } else {
    alert("Please enter both quote text and category.");
  }
}

// Function to save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Function to load quotes from local storage
function loadQuotes() {
  const savedQuotes = localStorage.getItem("quotes");
  if (savedQuotes) {
    quotes = JSON.parse(savedQuotes);
  }
}

// Function to filter quotes by category
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  const filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(quote => quote.category === selectedCategory);

  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = "";

  filteredQuotes.forEach(quote => {
    const quoteText = document.createElement("p");
    quoteText.textContent = quote.text;

    const quoteCategory = document.createElement("em");
    quoteCategory.textContent = ` - ${quote.category}`;

    quoteDisplay.appendChild(quoteText);
    quoteDisplay.appendChild(quoteCategory);
  });
}

// Function to update the category filter dropdown
function updateCategoryFilter() {
  const categoryFilter = document.getElementById("categoryFilter");
  const categories = ["all", ...new Set(quotes.map(quote => quote.category))];
  
  categoryFilter.innerHTML = categories.map(category => `<option value="${category}">${category}</option>`).join("");
}

// Function to export quotes to JSON
function exportToJson() {
  const quotesJson = JSON.stringify(quotes);
  const blob = new Blob([quotesJson], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Function to import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    updateCategoryFilter();
    alert("Quotes imported successfully!");
  };
  fileReader.readAsText(event.target.files[0]);
}

// Function to sync quotes with the server
async function syncQuotesWithServer() {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(quotes)
  });

  if (response.ok) {
    const serverQuotes = await response.json();
    console.log("Quotes synced with server:", serverQuotes);
  } else {
    console.error("Failed to sync quotes with server:", response.statusText);
  }
}

// Function to fetch quotes from the server
async function fetchQuotesFromServer() {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts');
  if (response.ok) {
    const serverQuotes = await response.json();
    quotes.push(...serverQuotes);
    saveQuotes();
    updateCategoryFilter();
    filterQuotes();
  } else {
    console.error("Failed to fetch quotes from server:", response.statusText);
  }
}

// Event listeners
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("addQuoteButton").addEventListener("click", addQuote);
document.getElementById("exportJson").addEventListener("click", exportToJson);
document.getElementById("importFile").addEventListener("change", importFromJsonFile);

// Load quotes from local storage and update category filter on page load
loadQuotes();
updateCategoryFilter();
filterQuotes();

// Periodically sync with server
setInterval(syncQuotesWithServer, 60000);
