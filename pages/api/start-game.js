export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const baseUrl = 'https://guess-the-quote-mauve.vercel.app';

  res.status(200).json({
    version: 'vNext',
    image: `${baseUrl}api/og`,
    buttons: [
      { label: 'Play', action: 'post', target: `${baseUrl}api/quote` },
    ],
    post_url: `${baseUrl}api/frame`,
  });
}
