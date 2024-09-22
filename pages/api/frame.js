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
    if (!buttonIndex || buttonIndex === 1) {
      const { quote, correctAuthor, wrongAuthor } = await fetchQuote();
      console.log('Fetched quote:', quote);

      html = `
        <html>
          <head>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content="${baseUrl}/api/og?quote=${encodeURIComponent(quote)}" />
            <meta property="fc:frame:button:1" content="${correctAuthor}" />
            <meta property="fc:frame:button:2" content="${wrongAuthor}" />
            <meta property="fc:frame:post_url" content="${baseUrl}/api/frame" />
            <meta property="fc:frame:state" content="${encodeURIComponent(JSON.stringify({ correctAuthor, wrongAuthor, totalAnswered: untrustedData?.state?.totalAnswered || 0 }))}" />
          </head>
        </html>
      `;
    } else {
      const state = JSON.parse(decodeURIComponent(untrustedData?.state || '{}'));
      const totalAnswered = (state.totalAnswered || 0) + 1;
      const selectedAuthor = buttonIndex === 2 ? state.wrongAuthor : state.correctAuthor;
      const isCorrect = selectedAuthor === state.correctAuthor;
      const message = isCorrect 
        ? `Correct! The author was ${selectedAuthor}. You've guessed ${totalAnswered} quotes correctly.` 
        : `Wrong. The correct author was ${state.correctAuthor}. You've guessed ${totalAnswered - 1} quotes correctly.`;
      
      console.log('Response message:', message);

      html = `
        <html>
          <head>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content="${baseUrl}/api/og?message=${encodeURIComponent(message)}" />
            <meta property="fc:frame:button:1" content="Next Quote" />
            <meta property="fc:frame:button:2" content="Share" />
            <meta property="fc:frame:post_url" content="${baseUrl}/api/frame" />
            <meta property="fc:frame:state" content="${encodeURIComponent(JSON.stringify({ totalAnswered }))}" />
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