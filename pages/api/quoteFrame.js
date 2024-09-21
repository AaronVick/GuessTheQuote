export default async function handler(req, res) {
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
  } while (wrongAuthor === correctAuthor); // Ensure wrong author is not the same as correct

  res.status(200).json({
    quote: quoteData.quote.body,
    correctAuthor: correctAuthor,
    wrongAuthor: wrongAuthor,
  });
}
