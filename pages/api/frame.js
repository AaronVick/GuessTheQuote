import { fetchQuote } from '../../utils/quoteService';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://guess-the-quote-mauve.vercel.app';
  const { untrustedData } = req.body;
  const buttonIndex = untrustedData?.buttonIndex;

  if (!buttonIndex || buttonIndex === 1) {
    // Start the game or get next quote
    const { quote, correctAuthor, wrongAuthor } = await fetchQuote();
    
    res.status(200).json({
      frame: {
        version: 'vNext',
        image: `${baseUrl}/api/og?quote=${encodeURIComponent(quote)}`,
        buttons: [
          { label: correctAuthor },
          { label: wrongAuthor }
        ],
        post_url: `${baseUrl}/api/frame`,
      },
      state: {
        correctAuthor,
        totalAnswered: untrustedData?.state?.totalAnswered || 0,
      },
    });
  } else {
    // Handle answer
    const selectedAuthor = buttonIndex === 2 ? untrustedData?.state?.correctAuthor : '';
    const totalAnswered = (untrustedData?.state?.totalAnswered || 0) + (selectedAuthor === untrustedData?.state?.correctAuthor ? 1 : 0);

    const isCorrect = selectedAuthor === untrustedData?.state?.correctAuthor;
    const message = isCorrect 
      ? `Correct! You've guessed ${totalAnswered} quotes correctly.` 
      : `Wrong. The correct author was ${untrustedData?.state?.correctAuthor}. You guessed ${totalAnswered} quotes correctly.`;

    res.status(200).json({
      frame: {
        version: 'vNext',
        image: `${baseUrl}/api/og?message=${encodeURIComponent(message)}`,
        buttons: [
          { label: 'Next Quote' },
          { label: 'End Game' },
        ],
        post_url: `${baseUrl}/api/frame`,
      },
      state: { totalAnswered },
    });
  }
}