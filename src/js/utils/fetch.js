export const fetchData = async (url, query = '') => {
  try {
    const data = await fetch(`${url}${query}`);
    return data.json();
  } catch (err) {
    console.log(err);
  }
};
