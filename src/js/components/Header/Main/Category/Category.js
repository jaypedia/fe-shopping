import Component from '../../../../core/Component.js';
import categoryStore from '../../../../store/CategoryStore.js';

export default class Category extends Component {
  categoryItem = () => this.$target.querySelector('.category__list');
  secondLayer = () => this.$target.querySelector('.category__layer--second');

  setup() {
    this.$state = {
      categoryData: categoryStore.getCategory(),
      firstContent: '',
      secondContent: '',
      secondContentArr: [],
      thirdContentArr: [],
      bannerImageSrc: '',
    };
  }

  template() {
    const { categoryData, bannerImageSrc, firstContent, secondContent } = this.$state;

    return /*html*/ `
    <div class="category__layer--first">
      <ul class="category__list">
      ${categoryData.reduce((acc, cur) => {
        return acc + `<li class="category__item first ${firstContent === cur.name ? 'selected-cate' : ''}">${cur.name}</li>`;
      }, '')}
      </ul>
    </div>

    <div class="category__layer--second">
      <ul class="category__list--second">
       ${this.$state.secondContentArr?.reduce((acc, cur) => {
         return (
           acc + `<li class="category__item second ${secondContent === cur.secondContent ? 'selected-cate' : ''}">${cur.secondContent}</li>`
         );
       }, '')}
       </ul>
       ${bannerImageSrc ? `<img class="category__layer--img" src=${bannerImageSrc} />` : ''}
    </div>

    <div class="category__layer--third">
      <ul class="category__list--third">
      ${this.$state.thirdContentArr?.reduce((acc, cur) => {
        return acc + `<li class="category__item third">${cur.thirdContent}</li>`;
      }, '')}
      </ul>
    </div>
    `;
  }

  setEvent() {
    const { categoryData } = this.$state;
    this.addEvent('mouseover', '.category__list', ({ target }) => {
      if (!target.closest('.category__item')) return;
      const firstContent = target.textContent.trim();
      if (firstContent === this.$state.firstContent) return;
      const secondContentArr = categoryData.find(v => v.name === firstContent).child;
      const bannerImageSrc = categoryData.find(v => v.name === firstContent).bannerImgSrc;
      this.setState({ firstContent, secondContentArr, bannerImageSrc });
    });

    this.addEvent('mouseover', '.second', ({ target }) => {
      const { secondContentArr } = this.$state;
      const secondContent = target.textContent.trim();
      const thirdContentArr = secondContentArr.find(v => v.secondContent === secondContent).child;
      if (thirdContentArr === this.$state.thirdContentArr) return;
      this.setState({ secondContent, thirdContentArr });
    });

    this.addEvent('mouseover', '.category__layer--first', () => {
      const cateLayerSecond = document.querySelector('.category__layer--second');
      cateLayerSecond.classList.add('show');
    });
  }
}
