import { fetchQuote } from '../../utils/quoteService';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://guess-the-quote-mauve.vercel.app';

  try {
    const { quote, correctAuthor, wrongAuthor } = await fetchQuote();
    
    console.log('Fetched quote:', { quote, correctAuthor, wrongAuthor });

    const response = {
      version: 'vNext',
      image: `${baseUrl}/api/og?quote=${encodeURIComponent(quote)}`,
      buttons: [
        { label: correctAuthor },
        { label: wrongAuthor }
      ],
      post_url: `${baseUrl}/api/answer`,
    };

    console.log('Sending response:', response);

    res.status(200).json(response);
  } catch (error) {
    console.error('Error in quote handler:', error);
    
    const errorResponse = {
      version: 'vNext',
      image: `${baseUrl}/api/og?message=${encodeURIComponent('An error occurred. Please try again.')}`,
      buttons: [
        { label: 'Try Again' }
      ],
      post_url: `${baseUrl}/api/quote`,
    };

    res.status(200).json(errorResponse);
  }
}