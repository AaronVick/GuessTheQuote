<html>
  <head>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${baseUrl}/api/og?quote=${encodeURIComponent(quote)}" />
    <meta property="fc:frame:button:1" content="${correctAuthor}" />
    <meta property="fc:frame:button:2" content="${wrongAuthor}" />
    <meta property="fc:frame:post_url" content="${baseUrl}/api/frame" />
  </head>
  <style>
    body {
      background-color: #121212;
      color: #FFFFFF;
      font-family: Arial, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }
    button {
      background-color: #333;
      color: #fff;
      padding: 10px 20px;
      border: none;
      margin: 10px;
      font-size: 16px;
      cursor: pointer;
    }
    button:hover {
      background-color: #555;
    }
  </style>
  <body>
    <div style="text-align: center;">
      <h1>Quote Game</h1>
      <p>${quote}</p>
      <div>
        <button>${correctAuthor}</button>
        <button>${wrongAuthor}</button>
      </div>
    </div>
  </body>
</html>
