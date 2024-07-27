document.addEventListener('DOMContentLoaded', () => {
    const quotes = [
      { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
      { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
      { text: "Good, better, best. Never let it rest. 'Til your good is better and your better is best.", category: "Motivation" }
    ];
  
    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteButton = document.getElementById('newQuote');
  
    function showRandomQuote() {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      const quote = quotes[randomIndex];
      quoteDisplay.innerHTML = `<p>${quote.text}</p><p><em>${quote.category}</em></p>`;
    }
  
    function createAddQuoteForm() {
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
    window.addQuote = createAddQuoteForm;
  
    // Show an initial quote when the page loads
    showRandomQuote();
  });
  