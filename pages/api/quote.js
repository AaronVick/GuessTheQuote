import { getQuoteAndAuthors } from '../../utils/quoteService';

export default async function handler(req, res) {
  const { quote, authors } = await getQuoteAndAuthors();

  // Generate a vercel OG image URL
  const ogImageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/og?quote=${encodeURIComponent(quote)}&author1=${encodeURIComponent(authors[0])}&author2=${encodeURIComponent(authors[1])}`;

  res.status(200).json({
    quote,
    authors,
    ogImageUrl,
  });
}
