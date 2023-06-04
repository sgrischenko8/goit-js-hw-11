import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';
const API = '37001375-196a5219cdc9346e7b5165ddc';

async function fetchEvents(q, page) {
  try {
    const { data } = await axios({
      params: {
        key: API,
        q,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        page,
        per_page: 40,
      },
    });
    return data;
  } catch (error) {
    console.log(error);
  }
}

export { fetchEvents };
