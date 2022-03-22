export const fetchData = async url => {
  try {
    const data = await fetch(url);
    return data.json();
  } catch (err) {
    console.log(err);
  }
};

export const fetchKeyword = async keyword => {
  try {
    const data = await fetch(`http://localhost:3000/autoComplete?keyword=${keyword}`);
    return data.json();
  } catch (err) {
    console.log(err);
  }
};

export const fetchBanner = async () => {
  try {
    const data = await fetch('http://localhost:3000/banner');
    return data.json();
  } catch (err) {
    console.log(err);
  }
};
