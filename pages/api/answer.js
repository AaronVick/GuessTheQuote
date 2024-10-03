import { fetchQuote } from '../../utils/quoteService';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://guess-the-quote-mauve.vercel.app';
  const { untrustedData } = req.body;
  const buttonIndex = untrustedData?.buttonIndex;
  const state = JSON.parse(decodeURIComponent(untrustedData?.state || '{}'));
  const { correctAuthor, wrongAuthor, totalAnswered = 0, correctCount = 0 } = state;

  console.log('Received data:', { buttonIndex, state });

  try {
    const newTotalAnswered = totalAnswered + 1;
    const isCorrect = buttonIndex === 1;
    const newCorrectCount = correctCount + (isCorrect ? 1 : 0);
    
    // Ensure we have a valid author name, even if state is incomplete
    const displayedAuthor = correctAuthor || 'the correct author';
    
    const message = isCorrect 
      ? `Correct! The author was ${displayedAuthor}. You've guessed ${newCorrectCount} quotes correctly out of ${newTotalAnswered}.` 
      : `Wrong. The correct author was ${displayedAuthor}. You've guessed ${newCorrectCount} quotes correctly out of ${newTotalAnswered}.`;

    const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${baseUrl}/api/og?message=${encodeURIComponent(message)}" />
    <meta property="fc:frame:button:1" content="Next Quote" />
    <meta property="fc:frame:button:2" content="Share Score" />
    <meta property="fc:frame:post_url" content="${baseUrl}/api/quote" />
    <meta property="fc:frame:state" content="${encodeURIComponent(JSON.stringify({ totalAnswered: newTotalAnswered, correctCount: newCorrectCount }))}" />
  </head>
  <body></body>
</html>`;

    console.log('Sending game HTML response:', html);
    res.setHeader('Content-Type', 'text/html');
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
    res.status(200).send(errorHtml);
  }
}