import { fetchQuote } from '../../utils/quoteService';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { untrustedData } = req.body;
  const buttonIndex = untrustedData?.buttonIndex;

  if (!buttonIndex || buttonIndex === 1) {
    // Start Game or Next Quote button pressed
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
    // Answer submitted
    const selectedAuthor = buttonIndex === 2 ? untrustedData?.inputText : '';
    const { correctAuthor } = await fetchQuote(); // Ensure you store the correct state for the current game to prevent re-fetching quotes.

    const isCorrect = selectedAuthor === correctAuthor;
    const totalAnswered = (untrustedData?.state?.totalAnswered || 0) + (isCorrect ? 1 : 0);

    if (isCorrect) {
      res.status(200).json({
        frame: {
          version: 'vNext',
          image: `${process.env.NEXT_PUBLIC_BASE_URL}/api/og?message=Correct! You've guessed ${totalAnswered} quotes correctly.`,
          buttons: [
            { label: 'Next Quote' },
            { label: 'End Game' }
          ],
          post_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/frame`,
        },
        state: {
          totalAnswered: totalAnswered,
        },
      });
    } else {
      const shareText = encodeURIComponent(`I guessed ${totalAnswered} quotes correctly in the Quote Game!\n\nFrame by @aaronv.eth`);
      const shareLink = `https://warpcast.com/~/compose?text=${shareText}&embeds[]=${encodeURIComponent(process.env
