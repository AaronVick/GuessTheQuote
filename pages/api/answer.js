export default function handler(req, res) {
  console.log('answer API called'); // Log when API is called
  console.log('Method:', req.method); // Log the method used

  if (req.method !== 'POST') {
    console.error('Method Not Allowed:', req.method); // Log error for invalid method
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { selectedAuthor, correctAuthor } = req.body;
    
    console.log('Received authors:', selectedAuthor, correctAuthor); // Log received data

    if (selectedAuthor === correctAuthor) {
      console.log('Correct answer'); // Log correct answer
      res.status(200).json({ result: 'Correct!' });
    } else {
      console.log('Incorrect answer'); // Log incorrect answer
      res.status(200).json({ result: 'Incorrect' });
    }
  } catch (error) {
    console.error('Error processing answer:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
