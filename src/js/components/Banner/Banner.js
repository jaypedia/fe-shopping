import Component from '../../core/Component.js';
import { fetchBanner } from '../../utils/fetch.js';

export default class Banner extends Component {
  setup() {
    this.$state = {
      bannerData: null,
    };
    this.bannerIdx = 0;
    this.bannerInterval = 3000;
  }

  mounted() {
    this.slideBanner();
  }

  template() {
    const { bannerData } = this.$state;

    return /*html*/ `
    <section class="banner">
    <div class="banner__selected-product">
      <ul class="banner__img-list">
        <li class="banner__img-item"></li>
      </ul>
      <div class="banner__thumbnail--container">
      <ul class="banner__thumbnail-list">
      ${bannerData?.reduce((acc, cur, idx) => {
        return (acc += ` <li class="banner__thumbnail-item first-item" data-idx=${idx}>
             <a href="https://pages.coupang.com/p/53507?from=home_C1&traid=home_C1&trcid=11131755">
              <img src=${cur.thumbnail} alt="thumbnail"/>
            </a>
          </li>`);
      }, '')}
      </ul>
      </div>
    </div>
  </section>
    `;
  }

  slideBanner() {
    const { bannerData } = this.$state;
    const bannerImg = document.querySelector('.banner__img-item');

    setInterval(() => slideBannerByIdx.bind(this)(), this.bannerInterval);

    function slideBannerByIdx() {
      if (bannerData && this.bannerIdx < bannerData.length) {
        const currentThumbnail = document.querySelector(`[data-idx="${this.bannerIdx}"]`);
        const previousThumbnail = currentThumbnail.previousElementSibling;
        if (!this.bannerIdx) {
          const lastThumbnail = document.querySelector(`[data-idx="${bannerData.length - 1}"]`);
          lastThumbnail.classList.remove('selected-banner');
        }
        currentThumbnail.classList.add('selected-banner');
        previousThumbnail && previousThumbnail.classList.remove('selected-banner');
        bannerImg.style.background = `url(${bannerData[this.bannerIdx++].banner}) center no-repeat`;
      }
      if (bannerData && this.bannerIdx >= bannerData.length) {
        this.bannerIdx = 0;
      }
    }
  }
}
