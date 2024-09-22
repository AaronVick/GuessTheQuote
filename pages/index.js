import Head from 'next/head';

export default function Home({ initialMetaTags }) {
  console.log('Rendering Home component');
  console.log('Initial meta tags:', JSON.stringify(initialMetaTags, null, 2));

  return (
    <div>
      <Head>
        <title>Guess the Quote</title>
        <meta property="og:title" content="Guess the Quote Game" />
        <meta property="og:image" content="https://guess-the-quote-mauve.vercel.app/guessQuote.png" />
        {initialMetaTags.map((tag, index) => {
          console.log(`Rendering meta tag: ${JSON.stringify(tag)}`);
          return <meta key={index} {...tag} />;
        })}
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
  console.log('Executing getServerSideProps');
  
  const baseUrl = 'https://guess-the-quote-mauve.vercel.app';
  
  const initialMetaTags = [
    { property: "fc:frame", content: "vNext" },
    { property: "fc:frame:image", content: `${baseUrl}/guessQuote.png` },
    { property: "fc:frame:button:1", content: "Play the Game" },
    { property: "fc:frame:post_url", content: `${baseUrl}/api/frame` },
  ];

  console.log('Generated initial meta tags:', JSON.stringify(initialMetaTags, null, 2));

  return {
    props: {
      initialMetaTags,
    },
  };
}