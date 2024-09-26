import { fetchQuote } from '../../utils/quoteService';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://guess-the-quote-mauve.vercel.app';
  const { untrustedData } = req.body;
  const buttonIndex = untrustedData?.buttonIndex;
  const correctAuthor = untrustedData?.state?.correctAuthor;
  const totalAnswered = (untrustedData?.state?.totalAnswered || 0) + (buttonIndex === 1 ? 1 : 0);

  const isCorrect = buttonIndex === 1;
  const message = isCorrect 
    ? `Correct! You've guessed ${totalAnswered} quotes correctly.` 
    : `Wrong. The correct author was ${correctAuthor}. You guessed ${totalAnswered} quotes correctly.`;

  console.log('Answer data:', { buttonIndex, correctAuthor, totalAnswered, isCorrect, message });

  try {
    // Fetch a new quote for the next round
    const { quote, correctAuthor: newCorrectAuthor, wrongAuthor: newWrongAuthor } = await fetchQuote();
    
    console.log('Fetched new quote:', { quote, newCorrectAuthor, newWrongAuthor });

    const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${baseUrl}/api/og?message=${encodeURIComponent(message)}" />
    <meta property="fc:frame:button:1" content="Next Quote" />
    <meta property="fc:frame:button:2" content="Share" />
    <meta property="fc:frame:button:2:action" content="post_redirect" />
    <meta property="fc:frame:post_url" content="${baseUrl}/api/start-game" />
    <meta property="fc:frame:state" content="${encodeURIComponent(JSON.stringify({ totalAnswered }))}" />
  </head>
  <body></body>
</html>`;

    console.log('Sending HTML response:', html);

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).send(html);
  } catch (error) {
    console.error('Error in answer handler:', error);
    
    const errorHtml = `
<!DOCTYPE html>
<html>
  <head>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${baseUrl}/api/og?message=${encodeURIComponent('An error occurred. Please try again.')}" />
    <meta property="fc:frame:button:1" content="Try Again" />
    <meta property="fc:frame:post_url" content="${baseUrl}/api/start-game" />
  </head>
  <body></body>
</html>`;

    console.log('Sending error HTML response:', errorHtml);

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).send(errorHtml);
  }
}