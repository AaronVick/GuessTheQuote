import Head from 'next/head';

export default function Home() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://guess-the-quote-mauve.vercel.app';

  return (
    <div>
      <Head>
        <title>Guess the Quote</title>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content={`${baseUrl}/guessQuote.png`} />
        <meta property="fc:frame:button:1" content="Play the Game" />
        <meta property="fc:frame:post_url" content={`${baseUrl}/api/frame`} />
        <meta property="fc:frame:state" content={encodeURIComponent(JSON.stringify({ stage: 'initial' }))} />
      </Head>
      <h1>Guess the Quote</h1>
      <img
        src="/guessQuote.png"
        alt="Guess the Quote"
        width="600"
        height="300"
      />
    </div>
  );
}