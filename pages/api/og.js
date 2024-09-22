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
          fontSize: 32,
          fontWeight: 600,
          color: '#FFFFFF',
        }}
      >
        <div style={{ marginBottom: 10, color: '#f0f0f0' }}>
          Quote Game
        </div>
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
