import Head from 'next/head';

export default function Home({ initialMetaTags }) {
  return (
    <div>
      <Head>
        <title>Guess the Quote</title>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="/guessQuote.png" />
        <meta property="fc:frame:button:1" content="Play the Game" />
        <meta property="fc:frame:post_url" content="/api/frame" />
        <dangerouslySetInnerHTML={{ __html: initialMetaTags }} />
      </Head>
      <h1>Guess the Quote</h1>
      <img
        src="/guessQuote.png"
        alt="Guess the Quote"
        width="600"
        height="300"
      />
      <button
        onClick={() => window.location.href = '/api/start-game'}
        style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px' }}
      >
        Play the Game
      </button>
    </div>
  );
}

export async function getServerSideProps() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://guess-the-quote-mauve.vercel.app';
  
  const initialMetaTags = `
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${baseUrl}/guessQuote.png" />
    <meta property="fc:frame:button:1" content="Play the Game" />
    <meta property="fc:frame:post_url" content="${baseUrl}/api/frame" />
  `;

  return {
    props: {
      initialMetaTags,
    },
  };
}
