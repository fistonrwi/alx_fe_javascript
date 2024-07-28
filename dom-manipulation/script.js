document.addEventListener('DOMContentLoaded', () => {
  let quotes = JSON.parse(localStorage.getItem('quotes')) || [];

  const quoteDisplay = document.getElementById('quoteDisplay');
  const newQuoteButton = document.getElementById('newQuote');
  const addQuoteButton = document.getElementById('addQuoteButton');
  const importFileInput = document.getElementById('importFile');
  const exportJsonButton = document.getElementById('exportJson');
  const categoryFilter = document.getElementById('categoryFilter');
  const syncButton = document.createElement('button');
  syncButton.textContent = 'Sync with Server';
  document.body.insertBefore(syncButton, exportJsonButton);

  const API_URL = 'https://jsonplaceholder.typicode.com/posts';

  async function fetchQuotesFromServer() {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      return data.slice(0, 5).map(item => ({
        text: item.title,
        category: 'Server'
      }));
    } catch (error) {
      console.error('Error fetching data from server:', error);
      return [];
    }
  }

  async function syncQuotes() {
    const serverQuotes = await fetchQuotesFromServer();
    const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];
    const mergedQuotes = mergeQuotes(localQuotes, serverQuotes);
    localStorage.setItem('quotes', JSON.stringify(mergedQuotes));
    quotes = mergedQuotes;
    populateCategories();
    filterQuotes();
    alert('Data synced with server!');
  }

  function mergeQuotes(localQuotes, serverQuotes) {
    const mergedQuotes = [...localQuotes];
    serverQuotes.forEach(serverQuote => {
      if (!localQuotes.some(localQuote => localQuote.text === serverQuote.text)) {
        mergedQuotes.push(serverQuote);
      }
    });
    return mergedQuotes;
  }

  function showRandomQuote() {
    const filteredQuotes = getFilteredQuotes();
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[randomIndex];
    quoteDisplay.innerHTML = `<p>${quote.text}</p><em>${quote.category}</em>`;
    sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
  }

  function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;

    if (newQuoteText && newQuoteCategory) {
      const newQuote = { text: newQuoteText, category: newQuoteCategory };
      quotes.push(newQuote);
      localStorage.setItem('quotes', JSON.stringify(quotes));
      populateCategories();
      document.getElementById('newQuoteText').value = '';
      document.getElementById('newQuoteCategory').value = '';
      alert('New quote added!');
    } else {
      alert('Please enter both a quote and a category.');
    }
  }

  function populateCategories() {
    const categories = [...new Set(quotes.map(quote => quote.category))];
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });
    const lastSelectedCategory = localStorage.getItem('selectedCategory') || 'all';
    categoryFilter.value = lastSelectedCategory;
  }

  function filterQuotes() {
    const selectedCategory = categoryFilter.value;
    localStorage.setItem('selectedCategory', selectedCategory);
    const filteredQuotes = getFilteredQuotes();
    if (filteredQuotes.length > 0) {
      const quote = filteredQuotes[0];
      quoteDisplay.innerHTML = `<p>${quote.text}</p><em>${quote.category}</em>`;
    } else {
      quoteDisplay.innerHTML = '<p>No quotes available in this category.</p>';
    }
  }

  function getFilteredQuotes() {
    const selectedCategory = categoryFilter.value;
    return selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);
  }

  function exportToJson() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      localStorage.setItem('quotes', JSON.stringify(quotes));
      populateCategories();
      alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
  }

  newQuoteButton.addEventListener('click', showRandomQuote);
  addQuoteButton.addEventListener('click', addQuote);
  exportJsonButton.addEventListener('click', exportToJson);
  importFileInput.addEventListener('change', importFromJsonFile);
  syncButton.addEventListener('click', syncQuotes);

  // Populate categories and set the last selected filter when the page loads
  populateCategories();
  filterQuotes();

  // Show the last viewed quote if available in session storage
  const lastViewedQuote = JSON.parse(sessionStorage.getItem('lastViewedQuote'));
  if (lastViewedQuote) {
    quoteDisplay.innerHTML = `<p>${lastViewedQuote.text}</p><em>${lastViewedQuote.category}</em>`;
  }

  // Show an initial quote when the page loads
  if (!lastViewedQuote) {
    showRandomQuote();
  }

  // Periodic data fetching to simulate server updates
  setInterval(syncQuotes, 60000); // Sync every 60 seconds
});
