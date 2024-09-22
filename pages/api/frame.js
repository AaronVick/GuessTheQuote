import { fetchQuote } from '../../utils/quoteService';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const baseUrl = 'https://guess-the-quote-mauve.vercel.app';
  const { untrustedData } = req.body;

  const buttonIndex = untrustedData?.buttonIndex;
  
  if (!buttonIndex || buttonIndex === 1) {
    const { quote, correctAuthor, wrongAuthor } = await fetchQuote();
    res.status(200).json({
      version: 'vNext',
      og: {
        image: `${baseUrl}api/og?quote=${encodeURIComponent(quote)}`,
      },
      frames: [
        {
          "button": correctAuthor,
          "target": `${baseUrl}api/frame`
        },
        {
          "button": wrongAuthor,
          "target": `${baseUrl}api/frame`
        }
      ]
    });
  } else {
    const message = `You've guessed incorrectly. The correct author was ${untrustedData?.state?.correctAuthor}.`;
    res.status(200).json({
      version: 'vNext',
      og: {
        image: `${baseUrl}api/og?message=${encodeURIComponent(message)}`,
      },
      frames: [
        {
          "button": "Next Quote",
          "target": `${baseUrl}api/frame`
        }
      ]
    });
  }
}
