export default function handler(req, res) {
    const { selectedAuthor, correctAuthor } = req.body;
  
    if (selectedAuthor === correctAuthor) {
      res.status(200).json({ result: 'Correct!' });
    } else {
      res.status(200).json({ result: 'Incorrect' });
    }
  }
  