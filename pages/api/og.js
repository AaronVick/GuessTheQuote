import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default function handler(req) {
  const { searchParams } = new URL(req.url);
  const quote = searchParams.get('quote');
  const message = searchParams.get('message');

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
          backgroundColor: '#121212',
          color: '#FFFFFF',
          fontSize: 32,
          fontWeight: 600,
        }}
      >
        <div style={{ marginBottom: 20, color: '#4CAF50' }}>Quote Game</div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}