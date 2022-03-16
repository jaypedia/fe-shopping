import { fetchData } from './util/util.js';

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
const searchAutoList = document.querySelector('.search__auto--list');
const searchHistory = document.querySelector('.search__history');
const searchHistoryList = document.querySelector('.search__history--list');
const searchForm = document.querySelector('.search');
const deleteAllBtn = document.querySelector('.delete-all-btn');
const searchWordArr = [];

searchInput.addEventListener('focus', () => {
  searchHistory.classList.add('show');
});

searchInput.addEventListener('focusout', () => {
  searchHistory.classList.remove('show');
  searchAuto.classList.remove('show');
});

// 검색어 추천 기능
searchInput.addEventListener('input', ({ target }) => {
  searchHistory.classList.remove('show');
  searchAuto.classList.add('show');
  if (!target.value) {
    searchHistory.classList.add('show');
    searchAuto.classList.remove('show');
    return;
  }
  const userInput = target.value;
  let suggestion = null;
  fetchData('/search').then(result => {
    suggestion = result.filter(item => item.keyword.includes(userInput));

    if (suggestion.length > 10) {
      suggestion = suggestion.slice(0, 10);
    }

    let items = '';
    suggestion.forEach(item => {
      const [unmatchedBefore, unmatchedAfter] = item.keyword.split(userInput);
      items += `<li class="search__auto--item">${unmatchedBefore}<span class="search__matched">${userInput}</span>${unmatchedAfter}</li>
      `;
    });

    searchAutoList.innerHTML = items;
  });
});

// 검색어 저장 기능
searchForm.addEventListener('submit', e => {
  e.preventDefault();
  const searchWord = searchInput.value;
  searchWordArr.unshift(searchWord); // 최신순으로 하기 위해 push가 아닌 unshift
  if (searchWordArr.length > 8) {
    // 검색어 저장 개수 8개까지로 제한
    searchWordArr.pop();
  }
  localStorage.setItem('searchWord', JSON.stringify(searchWordArr));
  renderSearchWord();
});

function renderSearchWord() {
  if (!localStorage.getItem('searchWord')) return;
  let searchItems = '';
  JSON.parse(localStorage.getItem('searchWord')).forEach(item => {
    searchItems += ` <li class="search__history--item">${item}</li>`;
  });
  searchHistoryList.innerHTML = searchItems;
}

renderSearchWord();
