import Head from 'next/head';

export default function Home({ initialMetaTags }) {
  return (
    <div>
      <Head>
        <title>Guess the Quote</title>
        <meta name="description" content="A fun game to guess the authors of famous quotes" />
        <meta property="og:title" content="Guess the Quote Game" />
        <meta property="og:description" content="Test your knowledge of famous quotes and their authors" />
        <meta property="og:image" content="https://guess-the-quote-mauve.vercel.app/guessQuote.png" />
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content={`${process.env.NEXT_PUBLIC_BASE_URL}/guessQuote.png`} />
        <meta property="fc:frame:button:1" content="Play the Game" />
        <meta property="fc:frame:post_url" content={`${process.env.NEXT_PUBLIC_BASE_URL}/api/frame`} />
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
  return {
    props: {},
  };
}