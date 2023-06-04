import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

axios.defaults.baseURL = 'https://pixabay.com/api/';
const API = '37001375-196a5219cdc9346e7b5165ddc';

const list = document.querySelector('.list');
const form = document.querySelector('.search-form');
const bottomBorder = document.querySelector('.bottom-border');

let pageToFetch = 1;
let queryToFetch = '';

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        loadMore();
      }
    });
  },
  { rootMargin: '200px' }
);

form.addEventListener('submit', onSubmit);

function onSubmit(event) {
  event.preventDefault();
  const inputValue = event.target.elements.searchQuery.value;
  if (inputValue.trim() !== '') {
    queryToFetch = inputValue;
    pageToFetch = 1;
    list.innerHTML = '';
    observer.unobserve(bottomBorder);
    getEvents(queryToFetch, pageToFetch);
  }
}

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

async function getEvents(query, page) {
  const data = await fetchEvents(query, page);
  const { totalHits } = data;
  const arrayOfQuerysSelect = data.hits;
  if (!data.total > 0) {
    Notiflix.Notify.failure(
      `Sorry, there are no images matching your search query. Please try again.`
    );
    return;
  }
  Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
  renderEvents(arrayOfQuerysSelect);
  if (data.totalHits !== list.children.length) {
    observer.observe(bottomBorder);
  }
}

function renderEvents(events) {
  const markup = events
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<li class="item">
        <a class="gallery-link" href="${largeImageURL}">
      <div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>${likes}
    </p>
    <p class="info-item">
      <b>Views</b>${views}
    </p>
    <p class="info-item">
      <b>Comments</b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${downloads}
    </p>
  </div>
</div>
   </a>
</li>`;
      }
    )
    .join('');
  list.insertAdjacentHTML('beforeend', markup);
  const lightbox = new SimpleLightbox('.item a', {
    captionDelay: 250,
  });
  lightbox.refresh();
}

async function loadMore() {
  pageToFetch += 1;
  const data = await fetchEvents(queryToFetch, pageToFetch);
  if (data.totalHits === list.children.length) {
    observer.unobserve(bottomBorder);
    return Notiflix.Notify.info(
      `We're sorry, but you've reached the end of search results.`
    );
  }
  const arrayOfQuerysSelect = data.hits;
  renderEvents(arrayOfQuerysSelect);
  smoothScroll();
}

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.list')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
