// Reference: https://gist.github.com/ali-master/b36c1fb5e0673107d090cd8a2d6a1f1e
const LocalStorageDB = function () {
  this.key = this.key || 'unknown';
  this.value = this.value || {};
};

LocalStorageDB.prototype.checkifSupport = function () {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
};

LocalStorageDB.prototype.set = function (key, value) {
  if (!this.checkifSupport()) {
    throw new TypeError('No support. Use a fallback such as browser cookies or store on the server.');
  }
  try {
    this.key = key;
    this.value = value;
    window.localStorage.setItem(this.key, this.value);
  } catch (e) {
    throw new TypeError('Exceeded Storage Quota!');
  }
};

LocalStorageDB.prototype.get = function (key) {
  try {
    this.key = key;
    const data = window.localStorage.getItem(this.key);
    if (data && typeof data === 'object') {
      return JSON.parse(data);
    } else {
      return data;
    }
  } catch (e) {
    return null;
  }
};

LocalStorageDB.prototype.getAll = function () {
  const array = new Array();
  for (let i = 0; i < window.localStorage.length; i++) {
    const key = localStorage.key(i);
    array.push(this.get(key));
  }
  return array;
};

LocalStorageDB.prototype.remove = function (key) {
  this.key = key;
  try {
    window.localStorage.removeItem(this.key);
    if (window.localStorage.length == 0) {
      this.clearAll();
    }
    return true;
  } catch (e) {
    return false;
  } finally {
    if (this.get(this.key)) {
      delete window.localStorage[this.key];
      if (window.localStorage.length == 0) {
        this.clearAll();
      }
    }
  }
};

LocalStorageDB.prototype.clearAll = function () {
  try {
    window.localStorage.clear();
    return true;
  } catch (e) {
    return false;
  }
};

export const localStorageDB = new LocalStorageDB();
