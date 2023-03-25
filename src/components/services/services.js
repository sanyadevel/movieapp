import axios from 'axios';

export const API_KEY = 'ec987f239ac912179a92ac312d07bcba';
export const guestSessionValue = localStorage.getItem('guest_session_id');

export const getGenresFromApi = async () => {
  const genresListFromApi = await axios.get(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`,
  );
  return genresListFromApi.data;
};

export const rateMovie = async (id, rating) => {
  try {
    if (guestSessionValue) {
      const jsonRatedMovies = await axios.post(
        `https://api.themoviedb.org/3/movie/${id}/rating?api_key=${API_KEY}&guest_session_id=${guestSessionValue}`,
        {
          value: rating,
        },
      );
    }
  } catch (e) {
    throw new Error(` ${e} Try to refresh the page or try later`);
  }
};

export const getGuestTokenId = async () => {
  try {
    const tokenDataJson = await axios.get(
      `https://api.themoviedb.org/3/authentication/guest_session/new?api_key=${API_KEY}`,
    );

    const tokenId = await tokenDataJson.data.guest_session_id;

    if (!guestSessionValue) {
      localStorage.setItem('guest_session_id', tokenId);
    }
  } catch (e) {
    throw new Error(` ${e} Try to refresh the page or try later`);
  }
};

export const getMoviesFromApi = async (
  SEARCH_TERM,
  PAGE,
  INCLUDE_ADULT_PARAM,
) => {
  const URL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${SEARCH_TERM}&page=${PAGE}&include_adult=${INCLUDE_ADULT_PARAM}`;
  const moviesListApi = await axios.get(URL);
  const { data } = moviesListApi;

  return data;
};

export const getRatedMoviesFromApi = async (page) => {
  let moviesData;
  try {
    const ratedMoviesAdress = `https://api.themoviedb.org/3/guest_session/${guestSessionValue}/rated/movies?api_key=${API_KEY}&language=en-US&sort_by=created_at.asc&page=${page}`;

    if (guestSessionValue) {
      const jsonRatedMovies = await axios.get(ratedMoviesAdress);
      moviesData = await jsonRatedMovies.data;
    }
  } catch (e) {
    throw new Error(`${e}, 'Try to refresh the page or try later `);
  }
  return moviesData;
};
