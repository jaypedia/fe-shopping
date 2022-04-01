import Component from '../../../../core/Component.js';

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
    ${searchCategoryData?.reduce((acc, cur) => acc + `<li>${cur}</li>`, '')}
    </ul>`;
  }

  setEvent() {
    this.addEvent('click', '.search__category', this.clickSearchCategoryHandler.bind(this));
  }

  clickSearchCategoryHandler({ target }) {
    this.toggleDropdown();
    if (!this.isCategoryItem(target)) return;
    this.setCurrentCategory(target);
  }

  toggleDropdown() {
    const searchCategoryOption = document.querySelector('.search__category--option');
    const searchCategoryButton = document.querySelector('.search__category--button');
    searchCategoryOption.classList.toggle('dropdown');
    searchCategoryButton.classList.toggle('up');
  }

  isCategoryItem(target) {
    return target.closest('.search__category--option');
  }

  setCurrentCategory(target) {
    const currentCategory = target.textContent;
    this.setState({ currentCategory });
  }
}
