export default async function handler(req, res) {
  console.log('quoteFrame API called'); // Log when API is called
  console.log('Method:', req.method); // Log the method used

  if (req.method !== 'GET') {
    console.error('Method Not Allowed:', req.method); // Log error for invalid method
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

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

    console.log('Returning quote and authors'); // Log success
    res.status(200).json({
      quote: quoteData.quote.body,
      correctAuthor: correctAuthor,
      wrongAuthor: wrongAuthor,
    });
  } catch (error) {
    console.error('Error fetching quote:', error); // Log fetch error
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
