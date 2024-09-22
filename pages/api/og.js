import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default function handler(req) {
  const { quote, message } = req.query;

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f0f0f0',
          fontSize: 32,
          fontWeight: 600,
        }}
      >
        <div style={{ marginBottom: 10, color: '#1da1f2' }}>Quote Game</div>
        {quote && (
          <div style={{ textAlign: 'center', margin: '20px 0', maxWidth: '80%' }}>
            "{quote}"
          </div>
        )}
        {message && (
          <div style={{ textAlign: 'center', margin: '20px 0', maxWidth: '80%' }}>
            {message}
          </div>
        )}
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
