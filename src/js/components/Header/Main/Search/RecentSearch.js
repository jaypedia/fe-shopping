import Component from '../../../../core/Component.js';

export default class RecentSearch extends Component {
  template() {
    const { searchWord } = this.$props;
    const items = searchWord?.length
      ? searchWord
          .sort((a, b) => b.id - a.id)
          .reduce((acc, cur) => {
            return (
              acc +
              `<li class="search__history--item" data-id="${cur.id}">
                  <span class="history__word">${cur.word}</span>
                  <span class="history__delete-btn">삭제</span>
                </li>`
            );
          }, '')
      : '';

    return `
    <h3 class="search__history--title">최근 검색어</h3>
    <div class="history-off-msg hide">최근 검색어 저장 기능이 꺼져 있습니다.</div>
    <ul class="search__history--list">
    ${items}
    </ul>
    <div class="search__history-btns">
      <span class="delete-all-btn">전체삭제</span>
      <span class="history-onoff-btn">최근검색어끄기</span>
    </div>
    `;
  }

  setEvent() {
    const { deleteAll, toggleHistory, deleteItem } = this.$props;
    this.addEvent('click', '.delete-all-btn', deleteAll);
    this.addEvent('click', '.history-onoff-btn', toggleHistory);
    this.addEvent('click', '.history__delete-btn', ({ target }) => deleteItem(target));
  }
}
