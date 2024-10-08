import { fetchQuote } from '../../utils/quoteService';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://guess-the-quote-mauve.vercel.app';
  const { untrustedData } = req.body;
  const state = JSON.parse(decodeURIComponent(untrustedData?.state || '{}'));
  const { totalAnswered = 0, correctCount = 0 } = state;

  try {
    const { quote, correctAuthor, wrongAuthor } = await fetchQuote();
    
    console.log('Fetched quote:', { quote, correctAuthor, wrongAuthor });

    const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${baseUrl}/api/og?quote=${encodeURIComponent(quote)}" />
    <meta property="fc:frame:button:1" content="${correctAuthor}" />
    <meta property="fc:frame:button:2" content="${wrongAuthor}" />
    <meta property="fc:frame:post_url" content="${baseUrl}/api/answer" />
    <meta property="fc:frame:state" content="${encodeURIComponent(JSON.stringify({ correctAuthor, wrongAuthor, totalAnswered, correctCount }))}" />
  </head>
  <body></body>
</html>`;

    console.log('Sending HTML response:', html);

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  } catch (error) {
    console.error('Error in quote handler:', error);
    
    const errorHtml = `
<!DOCTYPE html>
<html>
  <head>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${baseUrl}/api/og?message=${encodeURIComponent('An error occurred. Please try again.')}" />
    <meta property="fc:frame:button:1" content="Try Again" />
    <meta property="fc:frame:post_url" content="${baseUrl}/api/quote" />
  </head>
  <body></body>
</html>`;

    console.log('Sending error HTML response:', errorHtml);

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(errorHtml);
  }
}