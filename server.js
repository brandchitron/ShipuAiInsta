const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  const filePath = path.join(__dirname, "chitron.html");
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.send("<h1>🤖 𝐒𝐡𝐢𝐏𝐮 𝐀𝐢 🤖💨 is running | Chitron</h1>");
  }
});

app.listen(port, () => {
  console.log(`🌐 Web server is live on port ${port}`);
});
