import Component from './core/Component.js';
import Header from './components/Header/Header.js';
import Banner from './components/Banner/Banner.js';
import { fetchData } from './utils/utils.js';
import { URL } from './constants/constants.js';

export default class App extends Component {
  setup() {
    this.$state = {
      banner: null,
    };
  }

  template() {
    return `
    <header class="header"></header>
    <section class="banner"></section>
    <footer id="footer"></footer>
    `;
  }

  mounted() {
    const $header = document.querySelector('.header');
    const $banner = document.querySelector('.banner');
    new Header($header);
    const banner = new Banner($banner);
    this.$state.banner = banner;
    this.fetchAndSetBannerData(banner);
  }

  setEvent() {
    this.addEvent('click', '#app', this.hideLayer.bind(this));
  }

  hideLayer({ target }) {
    const searchAuto = document.querySelector('.search__auto');
    const searchHistory = document.querySelector('.search__history');
    const searchInput = document.querySelector('.search__input');
    const historyOnOffBtn = document.querySelector('.history-onoff-btn');
    const searchCategoryOption = document.querySelector('.search__category--option');

    if (target === searchInput || target === historyOnOffBtn) return;

    if (!target.closest('.search-layer')) {
      searchAuto.classList.remove('show');
      searchHistory.classList.remove('show');
    }

    if (!target.closest('.search__category')) {
      searchCategoryOption.classList.remove('dropdown');
    }
  }

  async fetchAndSetBannerData(banner) {
    try {
      const bannerData = await fetchData(URL.banner);
      banner.setState({ bannerData });
    } catch (err) {
      console.log(err);
    }
  }
}
