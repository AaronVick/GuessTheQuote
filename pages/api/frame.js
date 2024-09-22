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
      const { quote, correctAuthor, wrongAuthor } = await fetchQuote();

      res.status(200).json({
        "fc:frame": "vNext",
        "fc:frame:image": `${baseUrl}/api/og?quote=${encodeURIComponent(quote)}`,
        "fc:frame:button:1": correctAuthor,
        "fc:frame:button:2": wrongAuthor,
        "fc:frame:post_url": `${baseUrl}/api/frame`
      });
    } else {
      const totalAnswered = (untrustedData?.state?.totalAnswered || 0) + (buttonIndex === 2 ? 1 : 0);
      const isCorrect = buttonIndex === 2;
      const message = isCorrect 
        ? `Correct! You've guessed ${totalAnswered} quotes correctly.` 
        : `Wrong. The correct author was ${untrustedData?.state?.correctAuthor}. You've guessed ${totalAnswered} quotes correctly.`;

      res.status(200).json({
        "fc:frame": "vNext",
        "fc:frame:image": `${baseUrl}/api/og?message=${encodeURIComponent(message)}`,
        "fc:frame:button:1": "Next Quote",
        "fc:frame:button:2": "Share",
        "fc:frame:post_url": `${baseUrl}/api/frame`
      });
    }
  } catch (error) {
    console.error('Error in frame handler:', error);
    res.status(200).json({
      "fc:frame": "vNext",
      "fc:frame:image": `${baseUrl}/api/og?message=${encodeURIComponent('An error occurred. Please try again.')}`,
      "fc:frame:button:1": "Try Again",
      "fc:frame:post_url": `${baseUrl}/api/frame`
    });
  }
}