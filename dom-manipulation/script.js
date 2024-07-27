document.addEventListener('DOMContentLoaded', () => {
    let quotes = [
      { content: "Life is what happens when you're busy making other plans.", category: "Life" },
      { content: "The way to get started is to quit talking and begin doing.", category: "Motivation" },
      { content: "Don't watch the clock; do what it does. Keep going.", category: "Motivation" },
      { content: "The future belongs to those who believe in the beauty of their dreams.", category: "Inspiration" },
      { content: "It does not matter how slowly you go as long as you do not stop.", category: "Perseverance" }
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
  
    function displayRandomQuote() {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      const quote = quotes[randomIndex];
  
      // Clear the current content
      clearElement(quoteDisplay);
  
      // Create new elements
      const quoteText = createElementWithText('p', quote.content);
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
          content: quote.content,
          category: quote.author
        }));
        displayRandomQuote(); // Show an initial quote when the page loads
      } catch (error) {
        console.error('Error fetching quotes:', error);
      }
    }
  
    function addQuote() {
      const newQuoteText = document.getElementById('newQuoteText').value;
      const newQuoteCategory = document.getElementById('newQuoteCategory').value;
  
      if (newQuoteText && newQuoteCategory) {
        const newQuote = { content: newQuoteText, category: newQuoteCategory };
        quotes.push(newQuote);
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
        alert('New quote added!');
      } else {
        alert('Please enter both a quote and a category.');
      }
    }
  
    newQuoteButton.addEventListener('click', displayRandomQuote);
    window.addQuote = addQuote;
  
    // Fetch quotes from the API when the page loads
    fetchQuotes();
  });
  