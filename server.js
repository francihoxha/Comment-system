const express = require('express');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'comments.json');

app.use(cors());
app.use(express.json());

async function loadCommentsFromFile() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveCommentsToFile(comments) {
  await fs.writeFile(DATA_FILE, JSON.stringify(comments, null, 2), 'utf-8');
}

app.get('/comments', async (req, res) => {
  const comments = await loadCommentsFromFile();
  res.json(comments);
});

app.post('/comments', async (req, res) => {
  const { name, message } = req.body;
  if (!message) return res.status(400).json({ error: 'Mesazhi është i detyrueshëm' });

  const comments = await loadCommentsFromFile();
  const newComment = {
    id: Date.now(),
    name: name || 'Anonim',
    message,
    createdAt: new Date().toISOString()
  };
  comments.push(newComment);
  await saveCommentsToFile(comments);
  res.status(201).json(newComment);
});

app.delete('/comments', async (req, res) => {
  await saveCommentsToFile([]);
  res.json({ message: 'Të gjitha komentet u fshinë.' });
});

app.listen(PORT, () => {
  console.log(`✅ Serveri po punon tek http://localhost:${PORT}`);
});
