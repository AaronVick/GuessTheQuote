import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default function handler(req) {
  const { quote, result } = req.query;

  return new ImageResponse(
    (
      <div style={{ fontSize: 40, color: 'black', padding: '50px', textAlign: 'center' }}>
        <p>"{quote}"</p>
        <p>{result === 'Correct' ? 'Correct Answer!' : 'Wrong Answer!'}</p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
