import Head from 'next/head';

export default function Home() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://guess-the-quote-mauve.vercel.app';
  const shareText = encodeURIComponent(`Check out this awesome Quote Game!\n\nFrame by @aaronv.eth`);
  const shareLink = `https://warpcast.com/~/compose?text=${shareText}&embeds[]=${encodeURIComponent(baseUrl)}`;

  return (
    <div>
      <Head>
        <title>Guess the Quote</title>
        <meta name="description" content="A fun game to guess the authors of famous quotes" />
        <meta property="og:title" content="Guess the Quote Game" />
        <meta property="og:description" content="Test your knowledge of famous quotes and their authors" />
        <meta property="og:image" content={`${baseUrl}/guessQuote.png`} />
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content={`${baseUrl}/guessQuote.png`} />
        <meta property="fc:frame:button:1" content="Play the Game" />
        <meta property="fc:frame:button:2" content="Share" />
        <meta property="fc:frame:button:2:action" content="link" />
        <meta property="fc:frame:button:2:target" content={shareLink} />
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