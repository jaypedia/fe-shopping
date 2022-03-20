import Component from '../../../../core/Component.js';

export default class Category extends Component {
  template() {
    return `
    <button class="category__btn">카테고리</button>
    <div class="category__layer">
      <ul class="category__menu shopping-menu-list"></ul>
      <ul class="category__menu ticket-menu-list"></ul>
      <ul class="category__menu theme-menu-list"></ul>
    </div>
    `;
  }
}
