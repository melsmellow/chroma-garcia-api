import "dotenv/config";

import app from "./app.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
🚀 Chroma Garcia API is running

Local: http://localhost:${PORT}
Health: http://localhost:${PORT}/health
  `);
});