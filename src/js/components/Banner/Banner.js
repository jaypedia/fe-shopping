import Component from '../../core/Component.js';

export default class Banner extends Component {
  bannerList = () => this.$target.querySelector('.banner__img-list');
  selectedThumbnail = () => this.$target.querySelector('.selected-banner');

  setup() {
    this.$state = {
      bannerData: null,
    };
    this.MAX_CAROUSEL_COUNT = 5;
    this.preBannerIdx = 5;
    this.curBannerIdx = 0;
    this.bannerInterval = 3000;
    this.isMouseover = false;
    this.setCarouselInterval();
  }

  template() {
    const { bannerData } = this.$state;

    return /*html*/ `
    <section class="banner">
    <div class="banner__selected-product">
      <ul class="banner__img-list">
        ${bannerData?.reduce((acc, cur, idx) => {
          return (acc += `<li class="banner__img-item ${idx ? '' : 'show'}" data-banner-idx=${idx}>
            <img src=${cur.banner} alt="banner img" />
          </li>`);
        }, '')}
      </ul>
      <div class="banner__thumbnail--container">
      <ul class="banner__thumbnail-list">
      ${bannerData?.reduce((acc, cur, idx) => {
        return (acc += ` <li class="banner__thumbnail-item ${idx ? '' : 'selected-banner'}" data-thumb-idx=${idx}>
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
    this.addEvent('mouseover', '.banner__thumbnail-list', this.thumbnailMouseoverHandler.bind(this));
    this.addEvent('mouseout', '.banner__thumbnail-list', this.thumbnailMouseoutHandler.bind(this));
  }

  // Event Handler functions
  thumbnailMouseoverHandler({ target }) {
    this.isMouseover = true;
    this.showSelectedElements(target, { show: true });
    this.hideElements();
  }

  thumbnailMouseoutHandler({ target }) {
    this.isMouseover = false;
    this.showSelectedElements(target, { show: false });
    this.runCarousel();
  }

  showSelectedElements(target, { show }) {
    const targetIdx = target.closest('.banner__thumbnail-item').dataset.thumbIdx;
    const targetBanner = document.querySelector(`[data-banner-idx="${targetIdx}"]`);
    show ? targetBanner.classList.add('show') : targetBanner.classList.remove('show');
    this.setBannerIdx(targetIdx);
  }

  setBannerIdx(targetIdx) {
    this.curBannerIdx = Number(targetIdx);
    this.preBannerIdx = this.curBannerIdx === 0 ? this.MAX_CAROUSEL_COUNT : this.curBannerIdx - 1;
  }

  hideElements() {
    if (!this.selectedThumbnail()) return;
    const currentIdx = Number(this.selectedThumbnail().dataset.thumbIdx);
    if (currentIdx === this.curBannerIdx) return;
    this.hideCurrentBanner(currentIdx);
    this.removeSelectedThumbnail();
  }

  hideCurrentBanner(currentIdx) {
    const currentBanner = document.querySelector(`[data-banner-idx="${currentIdx}"]`);
    currentBanner.classList.remove('show');
  }

  removeSelectedThumbnail() {
    this.selectedThumbnail().classList.remove('selected-banner');
  }

  // Carousel Logics
  setCarouselInterval() {
    setInterval(() => {
      if (this.isMouseover) return;
      this.runCarousel();
    }, this.bannerInterval);
  }

  runCarousel() {
    this.removePreviousBanner();
    this.showCurrentBanner();
    this.increaseBannerIdx();
  }

  removePreviousBanner() {
    const previousBanner = document.querySelector(`[data-banner-idx="${this.preBannerIdx}"]`);
    const previousThumbnail = document.querySelector(`[data-thumb-idx="${this.preBannerIdx}"]`);
    previousBanner.classList.remove('show');
    previousThumbnail.classList.remove('selected-banner');
  }

  showCurrentBanner() {
    const currentBanner = document.querySelector(`[data-banner-idx="${this.curBannerIdx}"]`);
    const currentThumbnail = document.querySelector(`[data-thumb-idx="${this.curBannerIdx}"]`);
    currentBanner.classList.add('show');
    currentThumbnail.classList.add('selected-banner');
  }

  increaseBannerIdx() {
    this.preBannerIdx = this.preBannerIdx >= this.MAX_CAROUSEL_COUNT ? 0 : this.preBannerIdx + 1;
    this.curBannerIdx = this.curBannerIdx >= this.MAX_CAROUSEL_COUNT ? 0 : this.curBannerIdx + 1;
  }
}
