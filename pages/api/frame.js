import { fetchQuote } from '../../utils/quoteService';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { untrustedData } = req.body;
  const buttonIndex = untrustedData?.buttonIndex;

  if (!buttonIndex || buttonIndex === 1) {
    // Start the game
    const { quote, correctAuthor, wrongAuthor } = await fetchQuote();
    
    res.status(200).json({
      frame: {
        version: 'vNext',
        image: `${process.env.NEXT_PUBLIC_BASE_URL}/api/og?quote=${encodeURIComponent(quote)}`,
        buttons: [
          { label: correctAuthor },
          { label: wrongAuthor }
        ],
        post_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/frame`,
      },
    });
  } else {
    // Handle correct/incorrect answer
    const selectedAuthor = untrustedData?.inputText || '';
    const { correctAuthor } = await fetchQuote();

    const isCorrect = selectedAuthor === correctAuthor;

    const totalAnswered = (untrustedData?.state?.totalAnswered || 0) + (isCorrect ? 1 : 0);

    res.status(200).json({
      frame: {
        version: 'vNext',
        image: `${process.env.NEXT_PUBLIC_BASE_URL}/api/og?message=${isCorrect ? 'Correct!' : 'Wrong!'}`,
        buttons: [
          { label: 'Next Question' },
          { label: 'Play Again' },
        ],
        post_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/frame`,
      },
      state: { totalAnswered },
    });
  }
}
