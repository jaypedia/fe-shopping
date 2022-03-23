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
