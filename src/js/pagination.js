import FilmApiService from './apiService.js';
import markUpFilmCardTpl from '../templates/films.hbs';
import { renderTrendingMovies } from './showTrendingMovies.js';
import { initialize } from './showTrendingMovies.js';
import { createFilmCardsMarkUp } from './showTrendingMovies.js';

const cardFilm = document.querySelector('.js-card-film'),
  arrowLeft = document.querySelector('.arrow-left'),
  arrowRight = document.querySelector('.arrow-right'),
  paginationEl = document.querySelector('#pagination');

let currentPage = 1;
let pages = 20;
let pageCount;
let pagesSeach = 5;

const filmApiService = new FilmApiService();

function resetCurrentPage() {
  currentPage = 1;
}

function renderPagination(totalPages, result, fn, searchQuery) {
  paginationEl.innerHTML = '';
  resetCurrentPage();
  arrowLeft.removeEventListener('click', onClickArrowLeft);
  arrowRight.removeEventListener('click', onClickArrowRight);

  function createPagination(items, container, pages) {
    container.innerHTML = '';
    pageCount = totalPages;
    let maxLeftPage = currentPage - Math.floor(pagesSeach / 2);
    let maxRightPage = currentPage + Math.floor(pagesSeach / 2);

    if (maxLeftPage < 1) {
      maxLeftPage = 1;
      maxRightPage = pagesSeach;
    }

    if (maxRightPage > totalPages) {
      maxLeftPage = totalPages - (pagesSeach - 1);

      if (maxLeftPage < 1) {
        maxLeftPage = 1;
      }
      maxRightPage = totalPages;
    }

    for (let i = 1; i <= totalPages; i++) {
      if (maxLeftPage !== 1 && i == 1) {
        let btn = paginationButton(i, items);
        container.appendChild(btn);
      }

      if (maxRightPage !== totalPages && i == totalPages) {
        let btn = paginationButton(i, items);
        container.appendChild(btn);
      }

      if (i >= maxLeftPage && i <= maxRightPage) {
        let btn = paginationButton(i, items);
        container.appendChild(btn);
      }
      if (
        totalPages >= 6 &&
        i == 1 &&
        currentPage !== 1 &&
        currentPage !== 2 &&
        currentPage !== 3
      ) {
        const dotsEl = addDotsContainer();
        container.insertBefore(dotsEl, container[container.length - 2]);
      }

      if (
        pageCount >= 7 &&
        i == pageCount - 1 &&
        currentPage !== pageCount &&
        currentPage !== pageCount - 2 &&
        currentPage !== pageCount - 1
      ) {
        const dotsEl = addDotsContainer();
        container.insertBefore(dotsEl, container[1]);
      }
    }
  }

  function addDotsContainer() {
    const dots = document.createElement('div');
    dots.classList.add('dots');
    dots.innerText = '...';
    return dots;
  }

  function paginationButton(page, items) {
    let button = document.createElement('button');
    button.innerText = page;

    if (currentPage == page) {
      button.classList.add('active');
    }

    button.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      currentPage = page;
      //fn(cardFilm, currentPage, searchQuery);
      //renderTrendingMovies();

      let currentBtn = document.querySelector('.pages-numbers button.active');
      currentBtn.classList.remove('active');

      button.classList.add('active');
      createPagination(result, paginationEl, pages);
    });
    return button;
  }

  function onClickArrowLeft() {
    if (currentPage > 1) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      currentPage -= 1;
      createPagination(result, paginationEl, pages);
      //fn(cardFilm, currentPage, searchQuery);
      //renderTrendingMovies();
    }

    disableArrowBtn(totalPages);
  }

  function onClickArrowRight() {
    if (currentPage < totalPages) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      currentPage += 1;
      createPagination(result, paginationEl, pages);
      //fn(cardFilm, currentPage, searchQuery);
      //renderTrendingMovies();
    }
    disableArrowBtn(totalPages);
  }

  createPagination(result, paginationEl, pages);
  arrowLeft.onclick = onClickArrowLeft;
  arrowRight.onclick = onClickArrowRight;

  disableArrowBtn(totalPages);
}

paginationEl.addEventListener('click', disableArrowBtnAfterPageClick);

function disableArrowBtnAfterPageClick(event) {
  if (event.target.tagName != 'BUTTON') {
    return;
  } else {
    disableArrowBtn(pageCount);
  }
}

// неактивні стрілки на першій і останній сторінці

function disableArrowBtn(totalPages) {
  if (currentPage === 1) {
    arrowLeft.classList.add('disabled-arrow');
  } else {
    arrowLeft.classList.remove('disabled-arrow');
  }

  if (currentPage === totalPages) {
    arrowRight.classList.add('disabled-arrow');
  } else {
    arrowRight.classList.remove('disabled-arrow');
  }
}

renderPaginationPopulerFilms();

function renderPaginationPopulerFilms() {
  filmApiService
    .fetchTrendingMovies()
    .then(results => {
      renderPagination(results.total_pages, results.results);
    })
    .catch(error => console.log(error));
}

//function createListPage(container, page) {
//container.innerHTML = '';
//createPopularFilmsByPage(page)
//.then(markUpFilmCardTpl)
//.catch(error => console.log(error));
//}