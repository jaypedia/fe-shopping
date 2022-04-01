import Component from '../../../../core/Component.js';

export default class Autocomplete extends Component {
  setup() {
    this.$state = {
      suggestion: null,
      userInput: null,
    };
  }

  template() {
    const { suggestion, userInput } = this.$state;

    return `
        <ul class="search__auto--list">
        ${
          suggestion?.length
            ? suggestion?.reduce((acc, cur) => {
                const [unmatchedFront, unmatchedBack] = cur.keyword.split(userInput.trim());
                return (acc += `<li class="search__auto--item">${unmatchedFront}<span class="search__matched">${userInput}</span>${unmatchedBack}</li>`);
              }, '')
            : `<h3>검색 결과가 없습니다.</h3>`
        }
        </ul>
        `;
  }
}
