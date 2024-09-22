export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const baseUrl = 'https://guess-the-quote-mauve.vercel.app';
  const { untrustedData } = req.body;
  const buttonIndex = untrustedData?.buttonIndex;
  const correctAuthor = untrustedData?.state?.correctAuthor;
  const totalAnswered = (untrustedData?.state?.totalAnswered || 0) + (buttonIndex === 1 ? 1 : 0);

  const isCorrect = buttonIndex === 1;
  const message = isCorrect 
    ? `Correct! You've guessed ${totalAnswered} quotes correctly.` 
    : `Wrong. The correct author was ${correctAuthor}. You guessed ${totalAnswered} quotes correctly.`;

  const shareText = encodeURIComponent(`I guessed ${totalAnswered} quotes correctly in the Quote Game!\n\nFrame by @aaronv.eth`);
  const shareLink = `https://warpcast.com/~/compose?text=${shareText}&embeds[]=${encodeURIComponent(baseUrl)}`;

  res.status(200).json({
    version: 'vNext',
    image: `${baseUrl}api/og?message=${encodeURIComponent(message)}`,
    buttons: [
      { label: 'Next Quote' },
      { label: 'Share', action: 'link', target: shareLink },
    ],
    post_url: `${baseUrl}api/quote`,
  });
}
