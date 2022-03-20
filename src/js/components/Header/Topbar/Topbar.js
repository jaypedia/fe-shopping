import Component from '../../../core/Component.js';

export default class TopBar extends Component {
  template() {
    return `
        <div class="header__top-bar">
          <menu class="top-bar__subscribe">
            <li>즐겨찾기</li>
            <li>입점신청</li>
          </menu>
          <menu class="top-bar__menu">
            <li>로그인</li>
            <li>회원가입</li>
            <li>고객센터</li>
          </menu>
        </div>
    `;
  }
}
