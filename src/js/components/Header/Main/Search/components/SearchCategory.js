import Component from '../../../../../core/Component.js';

export default class SearchCategory extends Component {
  setup() {
    this.$state = {
      currentCategory: '전체',
      searchCategoryData: null,
    };
  }

  template() {
    const { searchCategoryData } = this.$state;
    return `
    <a href="#" class="search__category--current">${this.$state.currentCategory}</a>
    <a href="#" class="search__category--button"></a>
    <ul class="search__category--option">
    ${
      searchCategoryData
        ? searchCategoryData.reduce((acc, cur) => {
            return (acc += `<li>${cur}</li>`);
          }, '')
        : ''
    }
    </ul>`;
  }

  setEvent() {
    this.addEvent('click', '.search__category', ({ target }) => {
      this.setCurrentCategory(target);
    });
  }

  setCurrentCategory(target) {
    const searchCategoryOption = document.querySelector('.search__category--option');
    const searchCategoryButton = document.querySelector('.search__category--button');
    searchCategoryOption.classList.toggle('show');
    searchCategoryButton.classList.toggle('up');
    if (!target.closest('.search__category--option')) return;
    const searchCategory = target.textContent;
    this.setState({ searchCategory });
  }
}
