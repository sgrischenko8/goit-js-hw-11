import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

axios.defaults.baseURL = 'https://pixabay.com/api/';
const API = '37001375';

const list = document.querySelector('.list');
const searchBtn = document.querySelector('button');

let pageToFetch = 1;
let queryToFetch = '';

searchBtn.addEventListener('submit', onSubmit);

function onSubmit(event) {
  event.preventDefault();
  getEvents();
}

async function fetchEvents(q, page) {
  try {
    const { data } = await axios(`events.json`, {
      params: {
        key: API,
        q,
        image_type,
        orientation: horizontal,
        safesearch: true,
        page,
        per_page: 40,
      },
    });
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
}

function getEvents(query, page) {
  fetchEvents(query, page)
    .then(data => {
      console.log(data);
      if (!data.page.totalElements) {
        Notiflix.Notify.failure(
          `Sorry, there are no images matching your search query. Please try again.`
        );
        return;
      }
      //   renderEvents();
    })
    .finally(() => {
      console.log('lucky');
    });
}

// function renderEvents(events) {
//   const markup = events.map();
// }
