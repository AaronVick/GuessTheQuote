import { fetchQuote } from '../../utils/quoteService';

export default async function handler(req, res) {
  console.log('Frame API called');
  console.log('Request method:', req.method);
  console.log('Request body:', JSON.stringify(req.body, null, 2));

  if (req.method !== 'POST') {
    console.log('Method not allowed');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const baseUrl = 'https://guess-the-quote-mauve.vercel.app';
  const { untrustedData } = req.body;
  
  console.log('Untrusted data:', JSON.stringify(untrustedData, null, 2));
  
  const buttonIndex = untrustedData?.buttonIndex;
  console.log('Button index:', buttonIndex);

  try {
    if (!buttonIndex || buttonIndex === 1) {
      console.log('Fetching new quote');
      const { quote, correctAuthor, wrongAuthor } = await fetchQuote();
      console.log('Quote fetched:', quote);
      console.log('Correct author:', correctAuthor);
      console.log('Wrong author:', wrongAuthor);
      
      const response = {
        version: 'vNext',
        image: `${baseUrl}/api/og?quote=${encodeURIComponent(quote)}`,
        buttons: [
          { label: correctAuthor },
          { label: wrongAuthor }
        ],
        post_url: `${baseUrl}/api/frame`,
      };
      
      console.log('Sending response:', JSON.stringify(response, null, 2));
      res.status(200).json(response);
    } else {
      console.log('Handling answer');
      const selectedAuthor = buttonIndex === 2 ? untrustedData?.state?.correctAuthor : '';
      const totalAnswered = (untrustedData?.state?.totalAnswered || 0) + (selectedAuthor === untrustedData?.state?.correctAuthor ? 1 : 0);

      console.log('Selected author:', selectedAuthor);
      console.log('Total answered:', totalAnswered);

      const isCorrect = selectedAuthor === untrustedData?.state?.correctAuthor;
      const message = isCorrect 
        ? `Correct! You've guessed ${totalAnswered} quotes correctly.` 
        : `Wrong. The correct author was ${untrustedData?.state?.correctAuthor}. You guessed ${totalAnswered} quotes correctly.`;

      console.log('Is correct:', isCorrect);
      console.log('Message:', message);

      const response = {
        version: 'vNext',
        image: `${baseUrl}/api/og?message=${encodeURIComponent(message)}`,
        buttons: [
          { label: 'Next Quote' },
          { label: 'End Game' },
        ],
        post_url: `${baseUrl}/api/frame`,
      };

      console.log('Sending response:', JSON.stringify(response, null, 2));
      res.status(200).json(response);
    }
  } catch (error) {
    console.error('Error in frame handler:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}