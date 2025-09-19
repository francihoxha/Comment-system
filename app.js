const form = document.getElementById('comment-form');
const nameInput = document.getElementById('name');
const msgInput = document.getElementById('message');
const commentsEl = document.getElementById('comments');
const clearBtn = document.getElementById('clear-all');

const API_URL = 'http://localhost:3000/comments';

async function loadComments() {
  try {
    const res = await fetch(API_URL);
    const list = await res.json();
    if (list.length === 0) {
      commentsEl.innerHTML = '<p>Nuk ka komente ende. Bëhu ti i pari!</p>';
      return;
    }
    commentsEl.innerHTML = list
      .slice()
      .sort((a,b) => b.id - a.id)
      .map(c => `
        <article class="comment">
          <div class="meta">
            <strong>${c.name}</strong> · <span>${new Date(c.createdAt).toLocaleString()}</span>
          </div>
          <div class="body">${c.message}</div>
        </article>
      `).join('');
  } catch (err) {
    console.error('Gabim gjatë marrjes së komenteve:', err);
    commentsEl.innerHTML = '<p>Gabim gjatë marrjes së komenteve.</p>';
  }
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  const name = nameInput.value.trim() || 'Anonim';
  const message = msgInput.value.trim();
  if (!message) return;

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({name, message})
    });
    if (!res.ok) throw new Error('Gabim gjatë shtimit të komenteve');
    msgInput.value = '';
    loadComments();
  } catch (err) {
    console.error(err);
    alert('Nuk mund të shtohet komenti.');
  }
});

clearBtn.addEventListener('click', async () => {
  try {
    await fetch(API_URL, { method: 'DELETE' });
    loadComments();
  } catch (err) {
    console.error(err);
    alert('Nuk mund të fshihen komentet.');
  }
});

loadComments();
