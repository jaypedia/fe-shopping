import Component from '../../core/Component.js';

export default class Banner extends Component {
  setup() {
    this.$state = {
      bannerData: null,
    };
    this.bannerIdx = 0;
    this.bannerInterval = 3000;
    this.isMouseover = false;
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

  setEvent() {
    this.addEvent('mouseover', '.banner__thumbnail-list', ({ target }) => {
      this.isMouseover = true;
      const { bannerData } = this.$state;
      const currentBannerIdx = this.bannerIdx > 0 ? this.bannerIdx - 1 : bannerData.length - 1;
      const currentThumbnail = document.querySelector(`[data-idx="${currentBannerIdx}"]`);
      currentThumbnail.classList.remove('selected-banner');
      const targetIdx = target.closest('.banner__thumbnail-item').dataset.idx;
      const bannerImg = document.querySelector('.banner__img-item');
      bannerImg.style.background = `url(${bannerData[targetIdx].banner}) center no-repeat`;
    });

    this.addEvent('mouseout', '.banner__thumbnail-list', ({ target }) => {
      this.isMouseover = false;
      this.bannerIdx = target.closest('.banner__thumbnail-item').dataset.idx;
      this.slideBannerByIdx();
    });
  }

  slideBanner() {
    setInterval(() => {
      if (this.isMouseover) return;
      this.slideBannerByIdx();
    }, this.bannerInterval);
  }

  slideBannerByIdx() {
    const { bannerData } = this.$state;
    const bannerImg = document.querySelector('.banner__img-item');
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
