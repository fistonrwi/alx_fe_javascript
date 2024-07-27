document.addEventListener('DOMContentLoaded', () => {
    let quotes = [];
  
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
      const quoteText = createElementWithText('p', quote.content);
      const quoteAuthor = createElementWithText('em', quote.author);
  
      // Append elements to the display
      quoteDisplay.appendChild(quoteText);
      quoteDisplay.appendChild(quoteAuthor);
    }
  
    async function fetchQuotes() {
      try {
        const response = await fetch('https://api.quotable.io/quotes?limit=10');
        const data = await response.json();
        quotes = data.results;
        showRandomQuote(); // Show an initial quote when the page loads
      } catch (error) {
        console.error('Error fetching quotes:', error);
      }
    }
  
    function addQuote() {
      const newQuoteText = document.getElementById('newQuoteText').value;
      const newQuoteCategory = document.getElementById('newQuoteCategory').value;
  
      if (newQuoteText && newQuoteCategory) {
        const newQuote = { content: newQuoteText, author: newQuoteCategory };
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
  