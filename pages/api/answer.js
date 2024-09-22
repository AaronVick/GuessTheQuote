import { getQuoteAndAuthors } from '../../utils/quoteService';

export default async function handler(req, res) {
  const { quote, authors } = await getQuoteAndAuthors();
  const selectedAuthor = req.body.author;

  const isCorrect = selectedAuthor === authors[0];
  const responseText = isCorrect ? 'Correct!' : 'Incorrect.';

  const ogImageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/og?quote=${encodeURIComponent(quote)}&author1=${encodeURIComponent(authors[0])}&author2=${encodeURIComponent(authors[1])}`;

  res.status(200).json({
    responseText,
    ogImageUrl,
  });
}
