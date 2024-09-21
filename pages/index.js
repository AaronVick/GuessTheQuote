export default function Home() {
  return {
    props: {
      initialMetaTags: getMetaTags(),
    },
  };
}

function getMetaTags() {
  return `
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_BASE_URL}/guessQuote.png" />
    <meta property="fc:frame:button:1" content="Start Game" />
    <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/frame" />
  `;
}

export async function getServerSideProps() {
  return {
    props: {
      initialMetaTags: getMetaTags(),
    },
  };
}