export default function handler(req, res) {
  const { quote, authors, ogImageUrl } = req.body;

  res.status(200).json({
    "fc:frame:image": ogImageUrl,
    "fc:frame:quote": quote,
    "fc:frame:button:1": {
      type: "reload",
      title: "Play Again",
    },
    "fc:frame:button:2": {
      type: "link",
      title: "Share",
      target: `https://warpcast.com/~/compose?text=${encodeURIComponent(
        `I guessed the quote: "${quote}" correctly!`
      )}&embeds[]=${encodeURIComponent(ogImageUrl)}`,
    },
  });
}
