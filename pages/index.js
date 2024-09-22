import { useState } from 'react';

export default function Home() {
  const [gameStarted, setGameStarted] = useState(false);

  const startGame = () => {
    setGameStarted(true);
  };

  return (
    <div>
      <h1>Guess the Quote</h1>
      {!gameStarted ? (
        <div>
          <img
            src="/guessQuote.png"
            alt="Guess the Quote"
            width="600"
            height="300"
          />
          <button onClick={startGame}>Play the Game</button>
        </div>
      ) : (
        <iframe
          src="/api/frame"
          width="600"
          height="400"
          title="Quote Game Frame"
        />
      )}
    </div>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      initialMetaTags: `
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_BASE_URL}/guessQuote.png" />
        <meta property="fc:frame:button:1" content="Play the Game" />
        <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/frame" />
      `,
    },
  };
}
