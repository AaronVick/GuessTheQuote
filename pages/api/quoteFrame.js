export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

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

  res.status(200).json({
    quote: quoteData.quote.body,
    correctAuthor: correctAuthor,
    wrongAuthor: wrongAuthor,
  });
}
