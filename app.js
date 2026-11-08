'use strict';

const loadBtn     = document.getElementById('loadBtn');
const postsList   = document.getElementById('postsList');
const postForm    = document.getElementById('postForm');
const titleInput  = document.getElementById('titleInput');
const bodyInput   = document.getElementById('bodyInput');
const submitBtn   = document.getElementById('submitBtn');
const messageArea = document.getElementById('messageArea');

function showMessage(text, type = 'info') {
  messageArea.textContent = text;
  messageArea.className = `message message--${type}`;
}

function hideMessage() {
  messageArea.textContent = '';
  messageArea.className = 'message';
}

function renderPost(post) {
  const card = document.createElement('article');
  card.className = 'post-card';

  const titleEl = document.createElement('p');
  titleEl.className = 'post-card__title';
  titleEl.textContent = post.title;

  const bodyEl = document.createElement('p');
  bodyEl.className = 'post-card__body';
  bodyEl.textContent = post.body;

  card.appendChild(titleEl);
  card.appendChild(bodyEl);
  postsList.appendChild(card);
}

loadBtn.addEventListener('click', async () => {
  loadBtn.disabled = true;
  postsList.textContent = '';
  showMessage('Загрузка публикаций…', 'info');

  try {
    const response = await fetch(
      'https://jsonplaceholder.typicode.com/posts?_limit=5'
    );

    if (!response.ok) {
      throw new Error(`Ошибка сервера: ${response.status} ${response.statusText}`);
    }

    const posts = await response.json();

    hideMessage();
    posts.forEach(renderPost);

  } catch (err) {
    showMessage(`Не удалось загрузить публикации: ${err.message}`, 'error');
  } finally {
    loadBtn.disabled = false;
  }
});

postForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const title = titleInput.value.trim();
  const body  = bodyInput.value.trim();

  if (!title || !body) {
    showMessage('Пожалуйста, заполните оба поля — заголовок и текст.', 'error');
    return;
  }

  submitBtn.disabled = true;
  showMessage('Отправка публикации…', 'info');

  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body, userId: 1 }),
    });

    if (!response.ok) {
      throw new Error(`Ошибка сервера: ${response.status} ${response.statusText}`);
    }

    const created = await response.json();

    showMessage(
      `Публикация успешно создана! ID: ${created.id} · Заголовок: «${created.title}»`,
      'success'
    );

    postForm.reset();

  } catch (err) {
    showMessage(`Не удалось создать публикацию: ${err.message}`, 'error');
  } finally {
    submitBtn.disabled = false;
  }
});
