document.addEventListener('DOMContentLoaded', () => {
    let quotes = [
      { text: "Life is what happens when you're busy making other plans.", category: "Life" },
      { text: "The way to get started is to quit talking and begin doing.", category: "Motivation" },
      { text: "Don't watch the clock; do what it does. Keep going.", category: "Motivation" },
      { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Inspiration" },
      { text: "It does not matter how slowly you go as long as you do not stop.", category: "Perseverance" }
    ];
  
    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteButton = document.getElementById('newQuote');
  
    function showRandomQuote() {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      const quote = quotes[randomIndex];
      quoteDisplay.innerHTML = `<p>${quote.text}</p><em>${quote.category}</em>`;
    }
  
    async function fetchQuotes() {
      try {
        const response = await fetch('https://api.quotable.io/quotes?limit=10');
        const data = await response.json();
        quotes = data.results.map(quote => ({
          text: quote.content,
          category: quote.author
        }));
        showRandomQuote(); // Show an initial quote when the page loads
      } catch (error) {
        console.error('Error fetching quotes:', error);
      }
    }
  
    function addQuote() {
      const newQuoteText = document.getElementById('newQuoteText').value;
      const newQuoteCategory = document.getElementById('newQuoteCategory').value;
  
      if (newQuoteText && newQuoteCategory) {
        const newQuote = { text: newQuoteText, category: newQuoteCategory };
        quotes.push(newQuote);
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
        alert('New quote added!');
      } else {
        alert('Please enter both a quote and a category.');
      }
    }
  
    function createAddQuoteForm() {
      const formContainer = document.createElement('div');
      const quoteInput = document.createElement('input');
      quoteInput.id = 'newQuoteText';
      quoteInput.type = 'text';
      quoteInput.placeholder = 'Enter a new quote';
  
      const categoryInput = document.createElement('input');
      categoryInput.id = 'newQuoteCategory';
      categoryInput.type = 'text';
      categoryInput.placeholder = 'Enter quote category';
  
      const addButton = document.createElement('button');
      addButton.textContent = 'Add Quote';
      addButton.addEventListener('click', addQuote);
  
      formContainer.appendChild(quoteInput);
      formContainer.appendChild(categoryInput);
      formContainer.appendChild(addButton);
  
      document.body.appendChild(formContainer);
    }
  
    newQuoteButton.addEventListener('click', showRandomQuote);
    window.addQuote = addQuote;
  
    // Fetch quotes from the API when the page loads
    fetchQuotes();
  
    // Create the add quote form
    createAddQuoteForm();
  });
  