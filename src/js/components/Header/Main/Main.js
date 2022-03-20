import Component from '../../../core/Component.js';
import Category from './Category/Category.js';
import Search from './Search/Search.js';

export default class Main extends Component {
  mounted() {
    const $category = document.querySelector('.header__main--category');
    const $searchFormBox = document.querySelector('.search-form-box');
    new Category($category);
    new Search($searchFormBox);
  }

  template() {
    return /*html*/ `
    <div class="header__main--category"></div>
    <div class="header__main-box">
        <div class="header__main-box--top">
            <div class="logo-box">
            <a href="/" title="Coupang - 내가 잘사는 이유" class="logo">
                <img src="//image7.coupangcdn.com/image/coupang/common/logo_coupang_w350.png" width="174" height="41" alt="쿠팡로고" />
            </a>
        </div>

        <div class="search-form-box"></div>

        <ul class="icon-menu">
                <li class="icon-menu__my-coupang">
                  <div class="my-coupang__icon icon"></div>
                  <div class="my-coupang__title title">마이쿠팡</div>
                </li>
                <li class="icon-menu__cart">
                  <div class="cart__icon icon">
                    <span class="cart__count">0</span>
                  </div>
                  <div class="cart__title title">장바구니</div>
                </li>
            </ul>
        </div>
        <div class="header__main-box--gnb">
        <ul class="gnb-menu">
        <li class="rocket-delivery">
          <a href="https://www.coupang.com/np/campaigns/82" class="rocket-delivery">로켓배송</a>
        </li>
        <li class="rocket-fresh">
          <a href="https://www.coupang.com/np/categories/393760" class="rocket-fresh">로켓프레시</a>
          <i class="ic-new"></i>
        </li>
        <li class="business-mall-landing">
          <a href="https://login.coupang.com/corporation/member/landing-page" class="business-mall-landing">쿠팡비즈</a>
          <i class="ic-new"></i>
        </li>
        <li class="coupang-global">
          <a href="https://www.coupang.com/np/coupangglobal" class="coupang-global">로켓직구</a>
        </li>
        <li class="">
          <a href="https://www.coupang.com/np/goldbox" class="gold-box">골드박스</a>
        </li>
        <li class="subscription">
          <a href="https://www.coupang.com/np/campaigns/83" class="subscription">와우회원할인</a>
        </li>
        <li class="gnb-coupangbenefit">
          <a href="https://www.coupang.com/np/coupangbenefit" class="gnb-coupangbenefit">이벤트/쿠폰</a>
        </li>
        <li class="gnb-exhibition">
          <a href="https://www.coupang.com/np/exhibition" class="gnb-exhibition">기획전</a>
        </li>
        <li>
          <a href="https://trip.coupang.com?channel=gnb" class="travel">여행/티켓</a>
        </li>
      </ul>
        </div>
    `;
  }
}
