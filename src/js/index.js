const searchCategoryBtn = document.querySelector('.search__category');
const searchCategoryCurrent = document.querySelector('.search__category--current');
const searchCategoryOption = document.querySelector('.search__category--option');

searchCategoryBtn.addEventListener('click', ({ target }) => {
  searchCategoryOption.classList.toggle('show');
  if (!target.closest('.search__category--option')) return;
  searchCategoryCurrent.innerHTML = target.textContent;
});

const searchInput = document.querySelector('.search__input');
const searchAuto = document.querySelector('.search__auto');
const searchHistory = document.querySelector('.search__history');

searchInput.addEventListener('focus', () => {
  searchHistory.classList.add('show');
});

searchInput.addEventListener('focusout', () => {
  searchHistory.classList.remove('show');
  searchAuto.classList.remove('show');
});

searchInput.addEventListener('input', ({ target }) => {
  searchHistory.classList.remove('show');
  searchAuto.classList.add('show');
  if (!target.value) {
    searchHistory.classList.add('show');
    searchAuto.classList.remove('show');
  }
});
