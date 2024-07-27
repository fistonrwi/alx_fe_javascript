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
  
    function createElementWithText(tag, text) {
      const element = document.createElement(tag);
      element.textContent = text;
      return element;
    }
  
    function clearElement(element) {
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
    }
  
    function showRandomQuote() {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      const quote = quotes[randomIndex];
  
      // Clear the current content
      clearElement(quoteDisplay);
  
      // Create new elements
      const quoteText = createElementWithText('p', quote.text);
      const quoteCategory = createElementWithText('em', quote.category);
  
      // Append elements to the display
      quoteDisplay.appendChild(quoteText);
      quoteDisplay.appendChild(quoteCategory);
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
  
    newQuoteButton.addEventListener('click', showRandomQuote);
    window.addQuote = addQuote;
  
    // Fetch quotes from the API when the page loads
    fetchQuotes();
  });
  