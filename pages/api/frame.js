import { fetchQuote } from '../../utils/quoteService';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://guess-the-quote-mauve.vercel.app';
  const { untrustedData } = req.body;
  const buttonIndex = untrustedData?.buttonIndex;

  try {
    let html = '';
    const state = JSON.parse(decodeURIComponent(untrustedData?.state || '{}'));

    if (!state.stage || state.stage === 'initial') {
      // Initial state - fetch the first quote
      const { quote, correctAuthor, wrongAuthor } = await fetchQuote();
      console.log('Fetched initial quote:', quote);

      html = `
        <html>
          <head>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content="${baseUrl}/api/og?quote=${encodeURIComponent(quote)}" />
            <meta property="fc:frame:button:1" content="${correctAuthor}" />
            <meta property="fc:frame:button:2" content="${wrongAuthor}" />
            <meta property="fc:frame:post_url" content="${baseUrl}/api/frame" />
            <meta property="fc:frame:state" content="${encodeURIComponent(JSON.stringify({ correctAuthor, wrongAuthor, totalAnswered: 0, correctCount: 0, stage: 'question' }))}" />
          </head>
        </html>
      `;
    } else if (state.stage === 'question') {
      const totalAnswered = (state.totalAnswered || 0) + 1;
      const isCorrect = buttonIndex === 1;
      const correctCount = (state.correctCount || 0) + (isCorrect ? 1 : 0);
      const selectedAuthor = isCorrect ? state.correctAuthor : state.wrongAuthor;
      const message = isCorrect
        ? `Correct! The author was ${selectedAuthor}. You've guessed ${correctCount} quotes correctly out of ${totalAnswered}.`
        : `Wrong. The correct author was ${state.correctAuthor}. You've guessed ${correctCount} quotes correctly out of ${totalAnswered}.`;

      console.log('Response message:', message);

      const shareText = encodeURIComponent(`I've guessed ${correctCount} quotes correctly in the Quote Game!\n\nFrame by @aaronv.eth`);
      const shareLink = `https://warpcast.com/~/compose?text=${shareText}&embeds[]=${encodeURIComponent(baseUrl)}`;

      html = `
        <html>
          <head>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content="${baseUrl}/api/og?message=${encodeURIComponent(message)}" />
            <meta property="fc:frame:button:1" content="Next Quote" />
            <meta property="fc:frame:button:2" content="Share Score" />
            <meta property="fc:frame:button:2:action" content="link" />
            <meta property="fc:frame:button:2:target" content="${shareLink}" />
            <meta property="fc:frame:post_url" content="${baseUrl}/api/frame" />
            <meta property="fc:frame:state" content="${encodeURIComponent(JSON.stringify({ totalAnswered, correctCount, stage: 'next' }))}" />
          </head>
        </html>
      `;
    } else if (state.stage === 'next') {
      // Transitioning to the next question after "Next Quote"
      const { quote, correctAuthor, wrongAuthor } = await fetchQuote();
      console.log('Fetched next quote:', quote);

      html = `
        <html>
          <head>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content="${baseUrl}/api/og?quote=${encodeURIComponent(quote)}" />
            <meta property="fc:frame:button:1" content="${correctAuthor}" />
            <meta property="fc:frame:button:2" content="${wrongAuthor}" />
            <meta property="fc:frame:post_url" content="${baseUrl}/api/frame" />
            <meta property="fc:frame:state" content="${encodeURIComponent(JSON.stringify({ correctAuthor, wrongAuthor, totalAnswered: state.totalAnswered || 0, correctCount: state.correctCount || 0, stage: 'question' }))}" />
          </head>
        </html>
      `;
    }

    console.log('Sending HTML response:', html);
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  } catch (error) {
    console.error('Error in frame handler:', error);
    const errorHtml = `
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${baseUrl}/api/og?message=${encodeURIComponent('An error occurred. Please try again.')}" />
          <meta property="fc:frame:button:1" content="Try Again" />
          <meta property="fc:frame:post_url" content="${baseUrl}/api/frame" />
        </head>
      </html>
    `;
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(errorHtml);
  }
}
