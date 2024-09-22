import { fetchQuote } from '../../utils/quoteService';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const quoteData = await fetchQuote();
    res.status(200).json(quoteData);
  } catch (error) {
    res.status(500).json({ message: 'Failed to start the game', error: error.message });
  }
}
