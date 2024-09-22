export async function fetchQuote() {
  try {
    const quoteResponse = await fetch('https://favqs.com/api/qotd', {
      headers: {
        'Authorization': `Bearer ${process.env.FAVQS_API_KEY}`
      }
    });
    
    const quoteData = await quoteResponse.json();
    const correctAuthor = quoteData.quote.author;
    let wrongAuthor = '';

    do {
      const anotherQuoteResponse = await fetch('https://favqs.com/api/qotd', {
        headers: {
          'Authorization': `Bearer ${process.env.FAVQS_API_KEY}`
        }
      });
      const anotherQuoteData = await anotherQuoteResponse.json();
      wrongAuthor = anotherQuoteData.quote.author;
    } while (wrongAuthor === correctAuthor);

    return { quote: quoteData.quote.body, correctAuthor, wrongAuthor };
  } catch (error) {
    console.error("Error fetching quote:", error);
    throw new Error('Unable to fetch the quote at this time.');
  }
}
