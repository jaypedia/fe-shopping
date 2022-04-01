import { localStorageDB } from '../../../../utils/localStorageDB.js';
import { fetchData, isArrowKey } from '../../../../utils/utils.js';
import { URL } from '../../../../constants/constants.js';
import Component from '../../../../core/Component.js';
import SearchCategory from './components/SearchCategory.js';
import Autocomplete from './components/Autocomplete.js';
import RecentSearch from './components/RecentSearch.js';

export default class Search extends Component {
  searchInput = () => this.$target.querySelector('.search__input');
  searchAuto = () => this.$target.querySelector('.search__auto');
  searchAutoList = () => this.$target.querySelector('.search__auto--list');
  searchHistory = () => this.$target.querySelector('.search__history');
  searchHistoryList = () => this.$target.querySelector('.search__history--list');
  historyOffMsg = () => this.$target.querySelector('.history-off-msg');
  historyOnOffBtn = () => this.$target.querySelector('.history-onoff-btn');

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
    return /*html*/ `
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
    this.addEvent('focusin', '.search__input', this.inputFocusinHandler.bind(this));
    this.addEvent('focusout', '.search__input', this.initSelectedIdx.bind(this));
    this.addEvent('input', '.search__input', this.toggleAutocompleteLayer.bind(this));
    this.addEvent('submit', '.search', this.searchFormSubmitHandler.bind(this));
    this.addEvent('keyup', '.search__input', this.inputKeyupHandler.bind(this));
    this.addEvent('keydown', '.search__input', this.inputKeydownHandler.bind(this));
  }

  inputKeyupHandler(e) {
    const { autocomplete } = this.$state;
    if (isArrowKey(e.key)) return;
    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(() => {
      this.fetchSuggestion(e.target, autocomplete);
      this.initSelectedIdx();
    }, this.doneTypingInterval);
  }

  inputKeydownHandler(e) {
    clearTimeout(this.typingTimer);
    if (!isArrowKey(e.key)) return;
    if (e.key === 'ArrowUp') e.preventDefault();
    this.scrollAutocomplete(e.key);
  }

  searchFormSubmitHandler(e) {
    e.preventDefault();
    if (!this.historyOn) return;
    this.saveSearchWord();
    this.showSearchHistoryLayer(e.target);
  }

  inputFocusinHandler({ target }) {
    const { autocomplete } = this.$state;
    const userInput = target.value;
    if (!userInput) {
      this.showSearchHistoryLayer(target);
      return;
    }
    this.searchAuto().classList.add('show');
    this.fetchSuggestion(target, autocomplete);
  }

  initSelectedIdx() {
    this.selectedIdx = -1;
  }

  scrollAutocomplete(key) {
    const autoList = this.searchAutoList();

    if (!autoList.children.length) return;
    const MAX_IDX = autoList.children.length - 1;
    const INITIAL_IDX = -1;
    const direction = {
      ArrowUp: () => {
        if (this.selectedIdx <= 0) {
          this.selectedIdx = MAX_IDX + 1;
          autoList.children[0].classList.remove('selected');
        }
        autoList.children[--this.selectedIdx].classList.add('selected');
        const current = autoList.children[this.selectedIdx];
        this.searchInput().value = current.textContent;
        if (this.selectedIdx === MAX_IDX) return;
        autoList.children[this.selectedIdx].nextSibling.classList.remove('selected');
      },
      ArrowDown: () => {
        if (this.selectedIdx === MAX_IDX) {
          this.selectedIdx = INITIAL_IDX;
          autoList.children[MAX_IDX].classList.remove('selected');
        }
        autoList.children[++this.selectedIdx].classList.add('selected');
        const current = autoList.children[this.selectedIdx];
        this.searchInput().value = current.textContent;
        if (!this.selectedIdx) return;
        autoList.children[this.selectedIdx].previousSibling.classList.remove('selected');
      },
    };

    direction[key]();
  }

  toggleAutocompleteLayer({ target }) {
    const userInput = target.value;
    showAutocompleteLayer.bind(this)(userInput);
    if (!userInput) {
      hideAutocompleteLayer.bind(this)();
    }

    function showAutocompleteLayer(userInput) {
      if (userInput.length > 1) return;
      this.searchAuto().classList.add('show');
      this.searchHistory().classList.remove('show');
    }

    function hideAutocompleteLayer() {
      this.searchAuto().classList.remove('show');
      this.searchHistory().classList.add('show');
    }
  }

  async fetchSuggestion(target, autocomplete) {
    const userInput = target.value;
    try {
      const suggestion = await fetchData(URL.keyword, userInput);
      autocomplete.setState({ suggestion, userInput });
    } catch (err) {
      console.log(err);
    }
  }

  showSearchHistoryLayer(target) {
    if (!this.$state.searchWord.length) return;
    if (this.searchAuto().classList.contains('show') || target.value) return;
    this.searchHistory().classList.add('show');
  }

  saveSearchWord() {
    const MAX_RECENT_SEARCH_SIZE = 8;
    const word = this.searchInput().value;
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
    if (this.historyOn) {
      toggleHide.bind(this)();
      this.historyOn = false;
      this.historyOnOffBtn().textContent = '최근검색어켜기';
    } else {
      toggleHide.bind(this)();
      this.historyOn = true;
      this.historyOnOffBtn().textContent = '최근검색어끄기';
    }

    function toggleHide() {
      this.historyOffMsg().classList.toggle('hide');
      this.searchHistoryList().classList.toggle('hide');
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
