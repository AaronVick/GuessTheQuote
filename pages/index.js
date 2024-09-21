import Head from 'next/head';
import { useState, useEffect } from 'react';

export default function Home() {
  const [quote, setQuote] = useState('');
  const [correctAuthor, setCorrectAuthor] = useState('');
  const [wrongAuthor, setWrongAuthor] = useState('');
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Define shareLink globally for consistent access
  const shareText = encodeURIComponent(`I guessed ${totalAnswered} quotes correctly!\n\nFrame by @aaronv.eth `);
  const shareLink = `https://warpcast.com/~/compose?text=${shareText}&embeds[]=${encodeURIComponent(process.env.NEXT_PUBLIC_BASE_URL)}`;

  useEffect(() => {
    fetchQuote();
  }, []);

  const fetchQuote = async () => {
    console.log('Fetching quote...'); // Log when fetching starts
    try {
      const response = await fetch('/api/quoteFrame', {
        method: 'GET', // Ensure GET method is used for fetching quotes
      });
      const data = await response.json();
      setQuote(data.quote);
      setCorrectAuthor(data.correctAuthor);
      setWrongAuthor(data.wrongAuthor);
      setGameOver(false);
      console.log('Quote fetched successfully'); // Log success
    } catch (error) {
      console.error('Error fetching quote:', error); // Log any fetch errors
    }
  };
  
  const handleAnswer = async (selectedAuthor) => {
    console.log('Sending answer...'); // Log when sending answer
    try {
      const response = await fetch('/api/answer', {
        method: 'POST', // Ensure POST method is used for submitting answers
        body: JSON.stringify({ selectedAuthor, correctAuthor }),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
  
      if (data.result === 'Correct!') {
        setTotalAnswered(totalAnswered + 1);
        fetchQuote();
      } else {
        setGameOver(true);
      }
      console.log('Answer processed successfully'); // Log success
    } catch (error) {
      console.error('Error processing answer:', error); // Log any fetch errors
    }
  };  

  const shareStats = () => {
    window.open(shareLink, '_blank');
  };

  if (gameOver) {
    return (
      <div>
        <Head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content={`${process.env.NEXT_PUBLIC_BASE_URL}/guessQuote.png`} />
          <meta property="fc:frame:button:1" content="Play Again" />
          <meta property="fc:frame:button:1:type" content="link" /> {/* Updated to not reload */}
          <meta property="fc:frame:button:2" content="Share" />
          <meta property="fc:frame:button:2:type" content="link" />
          <meta property="fc:frame:button:2:target" content={shareLink} />
        </Head>
        <h1>Game Over!</h1>
        <p>You got {totalAnswered} quotes correct.</p>
        <button onClick={fetchQuote}>Play Again</button> {/* No reload, just restarts game */}
        <button onClick={shareStats}>Share</button>
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>Quote Game - Guess the Author</title>
        <meta property="og:title" content="Quote Game - Guess the Author" />
        <meta property="og:image" content={`${process.env.NEXT_PUBLIC_BASE_URL}/guessQuote.png`} />
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content={`${process.env.NEXT_PUBLIC_BASE_URL}/guessQuote.png`} />
        <meta property="fc:frame:button:1" content="Play the Game" />
        <meta property="fc:frame:button:1:type" content="link" />
        <meta property="fc:frame:button:2" content="Share" />
        <meta property="fc:frame:button:2:type" content="link" />
        <meta property="fc:frame:button:2:target" content={shareLink} />
      </Head>
      <img src="/guessQuote.png" alt="Guess the Quote" />
      <p>{quote}</p>
      <button onClick={() => handleAnswer(correctAuthor)}>Author 1: {correctAuthor}</button>
      <button onClick={() => handleAnswer(wrongAuthor)}>Author 2: {wrongAuthor}</button>
    </div>
  );
}
