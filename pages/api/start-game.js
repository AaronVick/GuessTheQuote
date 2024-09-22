import { fetchQuote } from '../../utils/quoteService';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const baseUrl = 'https://guess-the-quote-mauve.vercel.app';
  const { quote, correctAuthor, wrongAuthor } = await fetchQuote();

  res.status(200).json({
    version: 'vNext',
    image: `${baseUrl}/api/og?quote=${encodeURIComponent(quote)}`,
    buttons: [
      { label: correctAuthor },
      { label: wrongAuthor }
    ],
    post_url: `${baseUrl}/api/answer`,
  });
}