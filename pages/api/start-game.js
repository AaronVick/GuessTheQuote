export default function handler(req, res) {
  res.writeHead(301, {
    Location: '/api/quote',
  });
  res.end();
}
