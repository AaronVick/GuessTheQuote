import Head from 'next/head';

export default function Home({ initialMetaTags }) {
  return (
    <div>
      <Head>
        <title>Guess the Quote</title>
        <meta property="og:title" content="Guess the Quote Game" />
        <meta property="og:image" content="https://guess-the-quote-mauve.vercel.app/guessQuote.png" />
        {initialMetaTags.map((tag, index) => (
          <meta key={index} {...tag} />
        ))}
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

export async function getServerSideProps() {
  const baseUrl = 'https://guess-the-quote-mauve.vercel.app';
  
  const shareText = encodeURIComponent(`Check out this awesome Quote Game!\n\nFrame by @aaronv.eth`);
  const shareLink = `https://warpcast.com/~/compose?text=${shareText}&embeds[]=${encodeURIComponent(baseUrl)}`;

  const initialMetaTags = [
    { property: "fc:frame", content: "vNext" },
    { property: "fc:frame:image", content: `${baseUrl}/guessQuote.png` },
    { property: "fc:frame:button:1", content: "Play the Game" },
    { property: "fc:frame:button:2", content: "Share" },
    { property: "fc:frame:button:2:action", content: "link" },
    { property: "fc:frame:button:2:target", content: shareLink },
    { property: "fc:frame:post_url", content: `${baseUrl}/api/start-game` },
  ];

  return {
    props: {
      initialMetaTags,
    },
  };
}