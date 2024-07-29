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
    populateCategories();
    filterQuotes();
    sendQuoteToServer(newQuote);
    alert("Quote added successfully!");
  } else {
    alert("Please enter both quote text and category.");
  }
}

// Function to create the form for adding a new quote
function createAddQuoteForm() {
  const formContainer = document.createElement("div");

  const newQuoteTextInput = document.createElement("input");
  newQuoteTextInput.id = "newQuoteText";
  newQuoteTextInput.type = "text";
  newQuoteTextInput.placeholder = "Enter a new quote";
  formContainer.appendChild(newQuoteTextInput);

  const newQuoteCategoryInput = document.createElement("input");
  newQuoteCategoryInput.id = "newQuoteCategory";
  newQuoteCategoryInput.type = "text";
  newQuoteCategoryInput.placeholder = "Enter quote category";
  formContainer.appendChild(newQuoteCategoryInput);

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.onclick = addQuote;
  formContainer.appendChild(addButton);

  document.body.appendChild(formContainer);
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

// Function to populate categories in the dropdown menu
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const categories = ["all", ...new Set(quotes.map(quote => quote.category))];
  
  categoryFilter.innerHTML = categories.map(category => `<option value="${category}">${category}</option>`).join("");
}

// Function to export quotes to a JSON file
function exportToJsonFile() {
  const json = JSON.stringify(quotes, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    filterQuotes();
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

// Function to fetch quotes from a server (simulated) using async/await
async function fetchQuotesFromServer() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const data = await response.json();
    data.forEach(post => {
      quotes.push({ text: post.title, category: "Fetched" });
    });
    saveQuotes();
    populateCategories();
    filterQuotes();
    alert('Quotes synced with server!');
  } catch (error) {
    console.error('Error fetching quotes:', error);
  }
}

// Function to send a new quote to the server using POST request
async function sendQuoteToServer(quote) {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(quote)
    });
    const data = await response.json();
    console.log('Quote sent to server:', data);
  } catch (error) {
    console.error('Error sending quote to server:', error);
  }
}

// Function to sync quotes with the server and handle conflicts
async function syncQuotes() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const serverQuotes = await response.json();

    // Clear existing fetched quotes
    quotes = quotes.filter(quote => quote.category !== "Fetched");

    // Add server quotes
    serverQuotes.forEach(post => {
      quotes.push({ text: post.title, category: "Fetched" });
    });

    saveQuotes();
    populateCategories();
    filterQuotes();
    console.log('Quotes synced with server!');
  } catch (error) {
    console.error('Error syncing quotes with server:', error);
  }
}

// Event listeners
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Load quotes from local storage and update category filter on page load
loadQuotes();
populateCategories();
filterQuotes();

// Create the form for adding new quotes
createAddQuoteForm();

// Fetch quotes from server and populate the quotes array
fetchQuotesFromServer();
