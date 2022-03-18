import Component from '../../core/Component.js';
import TopBar from './TopBar/TopBar.js';
import Main from './Main/Main.js';

export default class Header extends Component {
  mounted() {
    const $topBar = document.querySelector('.header__top-bar--wrap');
    const $main = document.querySelector('.header__main');
    new TopBar($topBar);
    new Main($main);
  }

  template() {
    return `
        <div class="header__top-bar--wrap"></div>
        <main class="header__main"></main>
    `;
  }
}
