export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const baseUrl = 'https://guess-the-quote-mauve.vercel.app';
  const { untrustedData } = req.body;
  const buttonIndex = untrustedData?.buttonIndex;
  const correctAuthor = untrustedData?.state?.correctAuthor;
  const isCorrect = buttonIndex === 1;

  const message = isCorrect 
    ? `Correct!`
    : `Wrong. The correct author was ${correctAuthor}.`;

  res.status(200).json({
    version: 'vNext',
    image: `${baseUrl}/api/og?message=${encodeURIComponent(message)}`,
    buttons: [
      { label: 'Next Quote' },
      { label: 'Share', action: 'link', target: `https://warpcast.com/~/compose?text=I guessed correctly in the Quote Game!` },
    ],
    post_url: `${baseUrl}/api/quote`,
  });
}
