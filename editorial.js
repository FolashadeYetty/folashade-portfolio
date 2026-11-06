/* Editorial-only interactions. No newsletter data is stored or sent. */
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('[data-story-grid]');
  if (grid) {
    const filters = document.querySelector('.story-filters');
    const buttons = [...filters.querySelectorAll('[data-story-filter]')];
    const cards = [...grid.querySelectorAll('[data-story-category]')];
    const status = document.querySelector('.story-filter-status');
    filters.hidden = false;
    buttons.forEach((button) => button.addEventListener('click', () => {
      const category = button.dataset.storyFilter;
      buttons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
      cards.forEach((card) => {
        card.hidden = category !== 'all' && card.dataset.storyCategory !== category;
      });
      const count = cards.filter((card) => !card.hidden).length;
      status.textContent = `${count} ${count === 1 ? 'story' : 'stories'}${category === 'all' ? '' : ` in ${category}`}`;
    }));
  }
  document.querySelectorAll('[data-newsletter-form]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      form.querySelector('.newsletter-note').textContent = 'Subscriptions are not open yet. Your email has not been submitted.';
    });
  });
  const email = document.querySelector('[data-email-story]');
  if (email) {
    const title = document.querySelector('.article-heading h1').textContent;
    email.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${title}\n${location.href}`)}`;
  }
  const copy = document.querySelector('[data-copy-story]');
  if (copy && navigator.clipboard && window.isSecureContext) {
    copy.hidden = false;
    copy.addEventListener('click', async () => {
      const status = document.querySelector('.share-status');
      try {
        await navigator.clipboard.writeText(location.href);
        status.textContent = 'Story link copied.';
      } catch {
        status.textContent = 'Unable to copy. Please copy the address from your browser.';
      }
    });
  }
});
