export default function handler(req, res) {
    console.log('gameOver API called'); // Log when API is called
    console.log('Method:', req.method); // Log the method used
  
    if (req.method !== 'GET') {
      console.error('Method Not Allowed:', req.method); // Log error for invalid method
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
  
    try {
      res.status(200).json({ message: 'Game over logic reached successfully.' });
    } catch (error) {
      console.error('Error processing game over logic:', error); // Log fetch error
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  