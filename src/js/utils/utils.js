export const fetchData = async (url, query = '') => {
  try {
    const data = await fetch(`${url}${query}`);
    return data.json();
  } catch (err) {
    console.log(err);
  }
};

export const isArrowKey = key => {
  return key === 'ArrowUp' || key === 'ArrowDown';
};

// Ver's debounce function using Symbol
export const debounce = (fn, interval) => {
  let lastDebounceSymbol;
  return (...args) => {
    const symbol = Symbol();
    lastDebounceSymbol = symbol;
    setTimeout(() => {
      if (lastDebounceSymbol !== symbol) return;
      fn(...args);
    }, interval);
  };
};
