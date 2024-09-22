import { fetchQuote } from '../../utils/quoteService';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://guess-the-quote-mauve.vercel.app';
  const { untrustedData } = req.body;
  const buttonIndex = untrustedData?.buttonIndex;

  try {
    if (!buttonIndex || buttonIndex === 1) {
      // Start the game or get next quote
      const { quote, correctAuthor, wrongAuthor } = await fetchQuote();
      
      res.status(200).json({
        version: 'vNext',
        image: `${baseUrl}/api/og?quote=${encodeURIComponent(quote)}`,
        buttons: [
          { label: correctAuthor },
          { label: wrongAuthor }
        ],
        post_url: `${baseUrl}/api/frame`,
      });
    } else {
      // Handle answer
      const totalAnswered = (untrustedData?.state?.totalAnswered || 0) + (buttonIndex === 2 ? 1 : 0);
      const isCorrect = buttonIndex === 2;
      const message = isCorrect 
        ? `Correct! You've guessed ${totalAnswered} quotes correctly.` 
        : `Wrong. The correct author was ${untrustedData?.state?.correctAuthor}. You've guessed ${totalAnswered} quotes correctly.`;

      const shareText = encodeURIComponent(`I guessed ${totalAnswered} quotes correctly in the Quote Game!\n\nFrame by @aaronv.eth`);
      const shareLink = `https://warpcast.com/~/compose?text=${shareText}&embeds[]=${encodeURIComponent(baseUrl)}`;

      res.status(200).json({
        version: 'vNext',
        image: `${baseUrl}/api/og?message=${encodeURIComponent(message)}`,
        buttons: [
          { label: 'Next Quote' },
          { label: 'Share', action: 'link', target: shareLink },
        ],
        post_url: `${baseUrl}/api/frame`,
      });
    }
  } catch (error) {
    console.error('Error in frame handler:', error);
    res.status(500).json({
      version: 'vNext',
      image: `${baseUrl}/api/og?message=An error occurred`,
      buttons: [
        { label: 'Try Again' },
      ],
      post_url: `${baseUrl}/api/frame`,
    });
  }
}