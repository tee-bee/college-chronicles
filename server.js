// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.static('public'));

app.get('/posts', (req, res) => {
  const postsData = fs.readFileSync(path.join(__dirname, 'data', 'posts.json'), 'utf-8');
  let posts = JSON.parse(postsData);
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  res.json(posts);
});

// This route returns a single post based on slug
app.get('/post/:slug', (req, res) => {
  const postsData = fs.readFileSync(path.join(__dirname, 'data', 'posts.json'), 'utf-8');
  let posts = JSON.parse(postsData);

  const post = posts.find(p => p.slug === req.params.slug);
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  res.json(post);
});

// Hits endpoint
app.get('/hits', (req, res) => {
  const hitsFile = path.join(__dirname, 'data', 'hits.json');
  let hitsData = JSON.parse(fs.readFileSync(hitsFile, 'utf-8'));
  hitsData.count += 1;
  fs.writeFileSync(hitsFile, JSON.stringify(hitsData), 'utf-8');
  res.json({ count: hitsData.count });
});


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/archive', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'archive.html'));
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
