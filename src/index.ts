// import required packages and entities
import './css/styles.css';
import { fetchCountries, Country } from './fetchCountries';
import { markupOneCountry, markupSomeCountries } from './markup';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

type Refs = {
  input: HTMLInputElement | null;
  list: HTMLUListElement | null;
  output: HTMLDivElement | null;
};

// variable declaration
const DEBOUNCE_DELAY: number = 300;
let numberOfCountries: number = 0;

// create references to DOM elements
const refs: Refs = {
  input: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  output: document.querySelector('.country-info'),
};

// add an eventListener to the input
refs.input?.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

// function that run on the input event
function onSearch(e: Event): void {
  e.preventDefault();
  clearOutput();
  const nameOfSearchCountry: string | undefined = refs.input?.value.trim();
  if (nameOfSearchCountry) {
    fetchCountries(nameOfSearchCountry)
      .then((data: Country[]) => {
        numberOfCountries = data.length;
        render(data);
      })
      .catch(onFetchError);
  }
}

// markup render function on positive search result
function render(data: Country[]): void {
  // if the backend returned more than 10 countries
  if (numberOfCountries > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.',
      { position: 'center-top' }
    );
  }
  // if the backend returned from 2 to 10 countries
  else if (numberOfCountries > 1 && numberOfCountries < 10) {
    refs.list?.insertAdjacentHTML(
      'beforeend',
      data.map((country: Country) => markupSomeCountries(country)).join('')
    );
  }
  // if the backend returned 1 country
  else if (numberOfCountries === 1) {
    refs.output?.insertAdjacentHTML('beforeend', markupOneCountry(data[0]));
  }
}

// function to show a notification when there are no search results
function onFetchError(): void {
  Notiflix.Notify.failure('Oops, there is no country with that name', {
    position: 'center-top',
  });
}

// output cleaning function
function clearOutput(): void {
  if(refs.list && refs.output) {
    refs.list.innerHTML = '';
    refs.output.innerHTML = '';
  }
}
