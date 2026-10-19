// server.js
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

const app = express();
const PORT = 3000;

// Since __dirname doesn't exist natively in ES Modules, we define it manually:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Route the static public assets (like index.html)
// Add this line to server.js so the browser can access root files like main.js and states.js
app.use('/', express.static(path.join(__dirname, './')));

// 2. Route the /src path so the browser can read your modular source files
app.use('/src', express.static(path.join(__dirname, 'src')));

// Serve index.html as the root entry point
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`server is running at http://localhost:${PORT}`);
});