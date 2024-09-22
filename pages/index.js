import Head from 'next/head';

export default function Home({ initialMetaTags }) {
  return (
    <div>
      <Head>
        <title>Guess the Quote</title>
        <meta property="fc:frame:image" content="/guessQuote.png" />
        <meta property="fc:frame:button:1" content="Play the Game" />
        <meta property="fc:frame:post_url" content="/api/start-game" />
      </Head>
      <h1>Guess the Quote</h1>
      <img src="/guessQuote.png" alt="Guess the Quote" width="600" height="300" />
    </div>
  );
}

export async function getServerSideProps() {
  const initialMetaTags = `
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="/guessQuote.png" />
    <meta property="fc:frame:button:1" content="Play the Game" />
    <meta property="fc:frame:post_url" content="/api/start-game" />
  `;

  return {
    props: {
      initialMetaTags,
    },
  };
}
