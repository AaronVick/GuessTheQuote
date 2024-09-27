import { fetchQuote } from '../../utils/quoteService';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://guess-the-quote-mauve.vercel.app';
  const { untrustedData } = req.body;
  const buttonIndex = untrustedData?.buttonIndex;
  const state = JSON.parse(decodeURIComponent(untrustedData?.state || '{}'));
  const { correctAuthor, wrongAuthor, totalAnswered = 0, correctCount = 0, stage } = state;

  console.log('Received data:', { buttonIndex, state });

  try {
    if (buttonIndex === 2 && stage === 'answer') {
      // Handle share action
      const shareText = encodeURIComponent(`I've guessed ${correctCount} quotes correctly out of ${totalAnswered} questions! Can you beat my score?\n\nPlay now:`);
      const shareUrl = `https://warpcast.com/~/compose?text=${shareText}&embeds[]=${encodeURIComponent(baseUrl)}`;
      
      const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${baseUrl}/api/og?message=${encodeURIComponent(`Share your score: ${correctCount} correct out of ${totalAnswered} questions!`)}" />
    <meta property="fc:frame:button:1" content="Back to Game" />
    <meta property="fc:frame:button:2" content="Share Score" />
    <meta property="fc:frame:button:2:action" content="link" />
    <meta property="fc:frame:button:2:target" content="${shareUrl}" />
    <meta property="fc:frame:post_url" content="${baseUrl}/api/start-game" />
  </head>
  <body></body>
</html>`;

      console.log('Sending share HTML response:', html);
      res.setHeader('Content-Type', 'text/html');
      res.status(200).send(html);
      return;
    }

    let html;
    if (stage === 'question') {
      // This is the answer to a question
      const newTotalAnswered = totalAnswered + 1;
      const isCorrect = buttonIndex === 1;
      const newCorrectCount = correctCount + (isCorrect ? 1 : 0);
      const message = isCorrect 
        ? `Correct! The author was ${correctAuthor}. You've guessed ${newCorrectCount} quotes correctly out of ${newTotalAnswered}.` 
        : `Wrong. The correct author was ${correctAuthor}. You've guessed ${newCorrectCount} quotes correctly out of ${newTotalAnswered}.`;

      html = `
<!DOCTYPE html>
<html>
  <head>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${baseUrl}/api/og?message=${encodeURIComponent(message)}" />
    <meta property="fc:frame:button:1" content="Next Quote" />
    <meta property="fc:frame:button:2" content="Share Score" />
    <meta property="fc:frame:post_url" content="${baseUrl}/api/answer" />
    <meta property="fc:frame:state" content="${encodeURIComponent(JSON.stringify({ totalAnswered: newTotalAnswered, correctCount: newCorrectCount, stage: 'answer' }))}" />
  </head>
  <body></body>
</html>`;
    } else if (stage === 'answer' || !stage) {
      // This is the "Next Quote" button or initial state, so we should show a new quote
      const { quote, correctAuthor: newCorrectAuthor, wrongAuthor: newWrongAuthor } = await fetchQuote();
      
      console.log('Fetched new quote:', { quote, newCorrectAuthor, newWrongAuthor });

      html = `
<!DOCTYPE html>
<html>
  <head>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${baseUrl}/api/og?quote=${encodeURIComponent(quote)}" />
    <meta property="fc:frame:button:1" content="${newCorrectAuthor}" />
    <meta property="fc:frame:button:2" content="${newWrongAuthor}" />
    <meta property="fc:frame:post_url" content="${baseUrl}/api/answer" />
    <meta property="fc:frame:state" content="${encodeURIComponent(JSON.stringify({ totalAnswered, correctCount, correctAuthor: newCorrectAuthor, wrongAuthor: newWrongAuthor, stage: 'question' }))}" />
  </head>
  <body></body>
</html>`;
    }

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