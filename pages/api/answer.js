export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { selectedAuthor, correctAuthor } = req.body;

  if (selectedAuthor === correctAuthor) {
    res.status(200).json({ result: 'Correct!' });
  } else {
    res.status(200).json({ result: 'Incorrect' });
  }
}
