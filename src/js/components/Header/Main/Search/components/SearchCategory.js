import Component from '../../../../../core/Component.js';

export default class SearchCategory extends Component {
  setup() {
    this.$state = {
      searchCategory: '전체',
    };
  }

  template() {
    return `
  <a href="#" class="search__category--current">${this.$state.searchCategory}</a>
  <a href="#" class="search__category--button"></a>
  <ul class="search__category--option">
    <li><a href="#-1" rel="-1" class="">전체</a></li>
    <li><a href="#186764" rel="186764" class="">여성패션</a></li>
    <li><a href="#187069" rel="187069" class="">남성패션</a></li>
    <li><a href="#502993" rel="502993" class="">남녀 공용 의류</a></li>
    <li><a href="#213201" rel="213201" class="">유아동패션</a></li>
    <li><a href="#176522" rel="176522" class="">뷰티</a></li>
    <li><a href="#221934" rel="221934" class="">출산/유아동</a></li>
    <li><a href="#194276" rel="194276" class="">식품</a></li>
    <li><a href="#185669" rel="185669" class="">주방용품</a></li>
    <li><a href="#115673" rel="115673" class="">생활용품</a></li>
    <li><a href="#184555" rel="184555" class="">홈인테리어</a></li>
    <li><a href="#178255" rel="178255" class="">가전디지털</a></li>
    <li><a href="#317778" rel="317778" class="">스포츠/레저</a></li>
    <li><a href="#184060" rel="184060">자동차용품</a></li>
    <li><a href="#317777" rel="317777" class="">도서/음반/DVD</a></li>
    <li><a href="#317779" rel="317779">완구/취미</a></li>
    <li><a href="#177295" rel="177295">문구/오피스</a></li>
    <li><a href="#115674" rel="115674">반려동물용품</a></li>
    <li><a href="#305798" rel="305798">헬스/건강식품</a></li>
    <li><a href="#396463" rel="396463">국내여행</a></li>
    <li><a href="#396464" rel="396464">해외여행</a></li>
    <li><a href="#/np/campaigns/6733" rel="/np/campaigns/6733">로켓설치</a></li>
    <li><a href="#/np/campaigns/2318" rel="/np/campaigns/2318">공간별 집꾸미기</a></li>
    <li>
      <a href="#/np/campaigns/13570" rel="/np/campaigns/13570">헬스케어 전문관</a>
    </li>
    <li>
      <a href="#/np/campaigns/1440" rel="/np/campaigns/1440">쿠팡 Only</a>
    </li>
    <li><a href="#433784" rel="433784">싱글라이프</a></li>
    <li>
      <a href="#/np/campaigns/11354" rel="/np/campaigns/11354">악기전문관</a>
    </li>
    <li><a href="#416130" rel="416130">결혼준비</a></li>
    <li><a href="#410273" rel="410273">아트/공예</a></li>
    <li><a href="#316168" rel="316168">홈카페</a></li>
    <li><a href="#383370" rel="383370">실버스토어</a></li>
  </ul>
  `;
  }

  setEvent() {
    this.addEvent('click', '.search__category', ({ target }) => this.setSearchCategory(target));
  }

  setSearchCategory(target) {
    const searchCategoryOption = document.querySelector('.search__category--option');
    searchCategoryOption.classList.toggle('show');
    if (!target.closest('.search__category--option')) return;
    const searchCategory = target.textContent;
    this.setState({ searchCategory });
  }
}
