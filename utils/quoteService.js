export async function fetchQuote() {
  try {
    const response = await fetch('https://favqs.com/api/qotd', {
      headers: { 'Authorization': `Bearer ${process.env.FAVQS_API_KEY}` },
    });
    const data = await response.json();
    const correctAuthor = data.quote.author;
    let wrongAuthor = '';

    do {
      const anotherResponse = await fetch('https://favqs.com/api/qotd', {
        headers: { 'Authorization': `Bearer ${process.env.FAVQS_API_KEY}` },
      });
      const anotherData = await anotherResponse.json();
      wrongAuthor = anotherData.quote.author;
    } while (wrongAuthor === correctAuthor);

    return { quote: data.quote.body, correctAuthor, wrongAuthor };
  } catch (error) {
    console.error('Error fetching quote:', error);
    throw new Error('Unable to fetch quote.');
  }
}
