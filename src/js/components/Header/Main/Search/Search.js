import { localStorageDB } from '../../../../utils/localStorageDB.js';
import { fetchKeyword } from '../../../../utils/fetch.js';
import Component from '../../../../core/Component.js';
import SearchCategory from './components/SearchCategory.js';
import AutoComplete from './components/AutoComplete.js';
import RecentSearch from './components/RecentSearch.js';

export default class Search extends Component {
  setup() {
    this.$state = {
      searchWord: JSON.parse(localStorageDB.get('searchWord')) || [],
      historyOn: true,
      selectedIdx: 0,
      typingTimer: null,
      doneTypingInterval: 500,
      autoComplete: null,
    };
  }

  template() {
    return `
    <form class="search">
      <div class="search__category"></div>
      <input type="text" class="search__input" title="쿠팡 상품 검색" placeholder="찾고 싶은 상품을 검색해보세요!" />
      <a href="#" class="search__speech"></a>
      <a href="#" class="search__btn" title="검색"></a>
    </form>
    <div class="search__auto search-layer"></div>
    <div class="search__history search-layer"></div>
    `;
  }

  mounted() {
    const $searchCategory = document.querySelector('.search__category');
    const $searchAuto = document.querySelector('.search__auto');
    const $searchHistory = document.querySelector('.search__history');
    new SearchCategory($searchCategory);
    const autoComplete = new AutoComplete($searchAuto);
    this.$state.autoComplete = autoComplete;
    new RecentSearch($searchHistory, {
      searchWord: this.$state.searchWord,
      deleteAll: this.deleteAll.bind(this),
      deleteItem: this.deleteItem.bind(this),
      toggleHistory: this.toggleHistory.bind(this),
    });
  }

  setEvent() {
    this.addEvent('focusin', '.search__input', () => {
      this.showSearchHistoryLayer();
    });

    this.addEvent('submit', '.search', e => {
      e.preventDefault();
      if (!this.$state.historyOn) return;
      this.saveSearchWord();
      this.showSearchHistoryLayer();
    });

    this.addEvent('input', '.search__input', ({ target }) => {
      this.setAutoComplete(target);
    });

    this.addEvent('keyup', '.search__input', e => {
      const { autoComplete } = this.$state;
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') return;
      clearTimeout(this.$state.typingTimer);
      this.$state.typingTimer = setTimeout(() => this.displaySearchAutoList(e.target, autoComplete), this.$state.doneTypingInterval);
    });

    this.addEvent('keydown', '.search__input', e => {
      clearTimeout(this.$state.typingTimer);
      this.scrollAutoComplete(e);
    });
  }

  scrollAutoComplete(e) {
    const searchAutoList = document.querySelector('.search__auto--list');
    if (!searchAutoList.children.length) return;
    const maxIdx = searchAutoList.children.length - 1;

    if (e.key === 'ArrowUp') {
      if (this.$state.selectedIdx < 0) {
        this.$state.selectedIdx = maxIdx;
        searchAutoList.children[0].classList.remove('selected');
      }
      if (this.$state.selectedIdx > maxIdx) {
        this.$state.selectedIdx--;
      }
      searchAutoList.children[this.$state.selectedIdx].classList.add('selected');
      searchAutoList.children[this.$state.selectedIdx].previousSibling?.classList.remove('selected');
      searchAutoList.children[this.$state.selectedIdx].nextSibling?.classList.remove('selected');
      if (this.$state.selectedIdx >= 0) {
        this.$state.selectedIdx--;
      }
    } else if (e.key === 'ArrowDown') {
      if (this.$state.selectedIdx > maxIdx) {
        this.$state.selectedIdx = 0;
        searchAutoList.children[maxIdx].classList.remove('selected');
      }
      searchAutoList.children[this.$state.selectedIdx].classList.add('selected');
      searchAutoList.children[this.$state.selectedIdx].previousSibling?.classList.remove('selected');
      searchAutoList.children[this.$state.selectedIdx].nextSibling?.classList.remove('selected');
      if (this.$state.selectedIdx <= maxIdx) {
        this.$state.selectedIdx++;
      }
    }
  }

  setAutoComplete(target) {
    const searchHistory = document.querySelector('.search__history');
    const searchAuto = document.querySelector('.search__auto');
    const userInput = target.value;
    searchHistory.classList.remove('show');
    searchAuto.classList.add('show');

    if (!userInput) {
      searchHistory.classList.add('show');
      searchAuto.classList.remove('show');
      return;
    }
  }

  async displaySearchAutoList(target, autoComplete) {
    const userInput = target.value;
    try {
      const suggestion = await fetchKeyword(userInput);
      autoComplete.setState({ suggestion, userInput });
    } catch (err) {
      console.log(err);
    }
  }

  showSearchHistoryLayer() {
    const searchHistory = document.querySelector('.search__history');
    const $searchAuto = document.querySelector('.search__auto');
    if (!this.$state.searchWord.length) return;
    if ($searchAuto.classList.contains('show')) return;
    searchHistory.classList.add('show');
  }

  saveSearchWord() {
    const MAX_RECENT_SEARCH_SIZE = 8;
    const searchInput = document.querySelector('.search__input');
    const word = searchInput.value;
    if (this.$state.searchWord.find(item => item.word === word)) return;
    this.setState({ searchWord: [...this.$state?.searchWord, { id: Date.now(), word }] });
    if (this.$state.searchWord.length >= MAX_RECENT_SEARCH_SIZE) {
      this.$state.searchWord.pop();
    }
    localStorageDB.set('searchWord', JSON.stringify(this.$state.searchWord));
  }

  deleteAll() {
    localStorageDB.remove('searchWord');
    this.setState({ searchWord: Array() });
  }

  toggleHistory() {
    const searchHistoryList = document.querySelector('.search__history--list');
    const historyOffMsg = document.querySelector('.history-off-msg');
    const historyOnOffBtn = document.querySelector('.history-onoff-btn');
    if (this.$state.historyOn) {
      toggleHide();
      this.$state.historyOn = false;
      historyOnOffBtn.textContent = '최근검색어켜기';
    } else {
      toggleHide();
      this.$state.historyOn = true;
      historyOnOffBtn.textContent = '최근검색어끄기';
    }

    function toggleHide() {
      historyOffMsg.classList.toggle('hide');
      searchHistoryList.classList.toggle('hide');
    }
  }

  deleteItem(target) {
    const selectedItem = target.closest('.search__history--item');
    const itemId = Number(selectedItem.dataset.id);
    const searchWordArr = JSON.parse(localStorageDB.get('searchWord')).filter(item => item.id !== itemId);
    localStorageDB.set('searchWord', JSON.stringify(searchWordArr));
    this.setState({ searchWord: searchWordArr });
    this.showSearchHistoryLayer();
  }
}
