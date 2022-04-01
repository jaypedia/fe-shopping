import Store from './Store.js';
import { fetchData } from '../utils/utils.js';
import { URL } from '../constants/constants.js';

class CategoryStore extends Store {
  #key = 'category';

  constructor() {
    super();
  }

  async setup() {
    await this.fetchCategoryData();
  }

  getCategory() {
    return this.getState(this.#key);
  }

  async fetchCategoryData() {
    try {
      const categoryData = await fetchData(URL.category);
      this.setState(this.#key, categoryData);
    } catch (err) {
      console.log(err);
    }
  }
}

const categoryStore = new CategoryStore();
await categoryStore.setup();

export default categoryStore;
