import { localStorageDB } from '../../../../utils/localStorageDB.js';
import { fetchData } from '../../../../utils/utils.js';
import { URL } from '../../../../constants/constants.js';
import Component from '../../../../core/Component.js';
import SearchCategory from './components/SearchCategory.js';
import Autocomplete from './components/Autocomplete.js';
import RecentSearch from './components/RecentSearch.js';

export default class Search extends Component {
  setup() {
    this.$state = {
      searchWord: JSON.parse(localStorageDB.get('searchWord')) || [],
      searchCategory: null,
      autocomplete: null,
    };
    this.typingTimer = null;
    this.historyOn = true;
    this.selectedIdx = -1;
    this.doneTypingInterval = 500;
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
    const searchCategory = new SearchCategory($searchCategory);
    const autocomplete = new Autocomplete($searchAuto);
    this.$state.searchCategory = searchCategory;
    this.$state.autocomplete = autocomplete;
    new RecentSearch($searchHistory, {
      searchWord: this.$state.searchWord,
      deleteAll: this.deleteAll.bind(this),
      deleteItem: this.deleteItem.bind(this),
      toggleHistory: this.toggleHistory.bind(this),
    });
    this.fetchSearchCategoryData(searchCategory);
  }

  setEvent() {
    this.addEvent('focusin', '.search__input', ({ target }) => {
      const { autocomplete } = this.$state;
      this.showSearchHistoryLayer(target);
      if (!target.value) return;
      const $searchAuto = document.querySelector('.search__auto');
      $searchAuto.classList.add('show');
      this.displaySearchAutoList(target, autocomplete);
    });

    this.addEvent('focusout', '.search__input', () => {
      this.selectedIdx = -1;
    });

    this.addEvent('submit', '.search', e => {
      e.preventDefault();
      if (!this.historyOn) return;
      this.saveSearchWord();
      this.showSearchHistoryLayer();
    });

    this.addEvent('input', '.search__input', ({ target }) => {
      this.setAutocomplete(target);
    });

    this.addEvent('keyup', '.search__input', e => {
      const { autocomplete } = this.$state;
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') return;
      clearTimeout(this.typingTimer);
      this.typingTimer = setTimeout(() => {
        this.displaySearchAutoList(e.target, autocomplete);
        this.selectedIdx = -1;
      }, this.doneTypingInterval);
    });

    this.addEvent('keydown', '.search__input', e => {
      clearTimeout(this.typingTimer);
      if (!(e.key === 'ArrowUp' || e.key === 'ArrowDown')) return;
      this.scrollAutocomplete(e.key);
    });
  }

  scrollAutocomplete(key) {
    const searchAutoList = document.querySelector('.search__auto--list');
    if (!searchAutoList.children.length) return;
    const MAX_IDX = searchAutoList.children.length - 1;
    const INITIAL_IDX = -1;

    const searchInput = document.querySelector('.search__input');
    const direction = {
      ArrowUp: () => {
        if (this.selectedIdx <= 0) {
          this.selectedIdx = MAX_IDX + 1;
          searchAutoList.children[0].classList.remove('selected');
        }
        searchAutoList.children[--this.selectedIdx].classList.add('selected');
        const current = searchAutoList.children[this.selectedIdx];
        searchInput.value = current.textContent;
        if (this.selectedIdx === MAX_IDX) return;
        searchAutoList.children[this.selectedIdx].nextSibling.classList.remove('selected');
      },
      ArrowDown: () => {
        if (this.selectedIdx === MAX_IDX) {
          this.selectedIdx = INITIAL_IDX;
          searchAutoList.children[MAX_IDX].classList.remove('selected');
        }
        searchAutoList.children[++this.selectedIdx].classList.add('selected');
        const current = searchAutoList.children[this.selectedIdx];
        searchInput.value = current.textContent;
        if (!this.selectedIdx) return;
        searchAutoList.children[this.selectedIdx].previousSibling.classList.remove('selected');
      },
    };

    direction[key]();
  }

  setAutocomplete(target) {
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

  async displaySearchAutoList(target, autocomplete) {
    const userInput = target.value;
    try {
      const suggestion = await fetchData(URL.keyword, userInput);
      autocomplete.setState({ suggestion, userInput });
    } catch (err) {
      console.log(err);
    }
  }

  showSearchHistoryLayer(target) {
    const searchHistory = document.querySelector('.search__history');
    const $searchAuto = document.querySelector('.search__auto');
    if (!this.$state.searchWord.length) return;
    if ($searchAuto.classList.contains('show') || target.value) return;
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
    if (this.historyOn) {
      toggleHide();
      this.historyOn = false;
      historyOnOffBtn.textContent = '최근검색어켜기';
    } else {
      toggleHide();
      this.historyOn = true;
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

  async fetchSearchCategoryData(searchCategory) {
    try {
      const searchCategoryData = await fetchData(URL.searchCategory);
      searchCategory.setState({ searchCategoryData });
    } catch (err) {
      console.log(err);
    }
  }
}
