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
        og: {
          title: "Guess the Quote Game",
          description: "Test your knowledge of famous quotes!",
          image: `${baseUrl}/api/og?quote=${encodeURIComponent(quote)}`
        },
        frames: [
          {
            version: "vNext",
            image: `${baseUrl}/api/og?quote=${encodeURIComponent(quote)}`,
            button_1: correctAuthor,
            button_2: wrongAuthor,
            post_url: `${baseUrl}/api/frame`
          }
        ],
      });
    } else {
      const totalAnswered = (untrustedData?.state?.totalAnswered || 0) + (buttonIndex === 2 ? 1 : 0);
      const isCorrect = buttonIndex === 2;
      const message = isCorrect 
        ? `Correct! You've guessed ${totalAnswered} quotes correctly.` 
        : `Wrong. The correct author was ${untrustedData?.state?.correctAuthor}. You've guessed ${totalAnswered} quotes correctly.`;

      res.status(200).json({
        og: {
          title: "Guess the Quote Game - Result",
          description: message,
          image: `${baseUrl}/api/og?message=${encodeURIComponent(message)}`
        },
        frames: [
          {
            version: "vNext",
            image: `${baseUrl}/api/og?message=${encodeURIComponent(message)}`,
            button_1: "Next Quote",
            button_2: "Share",
            post_url: `${baseUrl}/api/frame`
          }
        ],
      });
    }
  } catch (error) {
    console.error('Error in frame handler:', error);
    res.status(500).json({
      og: {
        title: "Guess the Quote Game - Error",
        description: "An error occurred. Please try again.",
        image: `${baseUrl}/api/og?message=${encodeURIComponent('An error occurred. Please try again.')}`
      },
      frames: [
        {
          version: "vNext",
          image: `${baseUrl}/api/og?message=${encodeURIComponent('An error occurred. Please try again.')}`,
          button_1: "Try Again",
          post_url: `${baseUrl}/api/frame`
        }
      ],
    });
  }
}