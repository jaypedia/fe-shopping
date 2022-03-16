import { fetchData } from './util/util.js';

// 검색 카테고리 부분
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
const historyOnOffBtn = document.querySelector('.history-onoff-btn');
const searchWordArr = [];

searchInput.addEventListener('focus', () => {
  if (!localStorage.getItem('searchWord')) return;
  searchHistory.classList.add('show');
});

deleteAllBtn.addEventListener('click', () => {
  localStorage.removeItem('searchWord');
  renderSearchHistory();
  searchHistory.classList.remove('show');
});

let historyOn = true;
historyOnOffBtn.addEventListener('click', () => {
  if (historyOn) {
    historyOn = false;
    searchHistoryList.innerHTML = `<h3 class="history-off-msg">최근 검색어 저장 기능이 꺼져 있습니다.</h3>`;
    historyOnOffBtn.textContent = '최근검색어켜기';
  } else {
    historyOn = true;
    renderSearchHistory();
    historyOnOffBtn.textContent = '최근검색어끄기';
  }
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

    if (!suggestion.length) {
      searchAutoList.innerHTML = `<h3>검색 결과가 없습니다.</h3>`;
      return;
    }

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
  renderSearchHistory();
});

function renderSearchHistory() {
  if (!localStorage.getItem('searchWord')) {
    searchHistoryList.innerHTML = '';
    return;
  }
  let searchItems = '';
  JSON.parse(localStorage.getItem('searchWord')).forEach(item => {
    searchItems += ` <li class="search__history--item">${item}</li>`;
  });
  searchHistoryList.innerHTML = searchItems;
}

renderSearchHistory();

window.addEventListener('click', ({ target }) => {
  if (target === searchInput || target === historyOnOffBtn) return;
  if (!target.classList.contains('search-layer')) {
    searchAuto.classList.remove('show');
    searchHistory.classList.remove('show');
  }
});
