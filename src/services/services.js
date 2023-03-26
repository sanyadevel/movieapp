import axios from 'axios';

export const API_KEY = 'ec987f239ac912179a92ac312d07bcba';

export const getGenresFromApi = async () => {
  const genresListFromApi = await axios.get(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`,
  );
  return genresListFromApi.data;
};

export const rateMovie = async (id, rating, tokenId) => {
  try {
    const jsonRatedMovies = await axios.post(
      `https://api.themoviedb.org/3/movie/${id}/rating?api_key=${API_KEY}&guest_session_id=${tokenId}`,
      {
        value: rating,
      },
    );
  } catch (e) {
    throw new Error(` ${e} Try to refresh the page or try later`);
  }
};

export const getGuestTokenId = async () => {
  let tokenId;
  try {
    const tokenDataJson = await axios.get(
      `https://api.themoviedb.org/3/authentication/guest_session/new?api_key=${API_KEY}`,
    );
    tokenId = await tokenDataJson.data.guest_session_id;
  } catch (e) {
    throw new Error(` ${e} Try to refresh the page or try later`);
  }
  return tokenId;
};

export const getMoviesFromApi = async (
  searchTerm,
  page,
  isIncludedAdultParam,
) => {
  const URL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${searchTerm}&page=${page}&include_adult=${isIncludedAdultParam}`;
  const moviesListApi = await axios.get(URL);
  const { data } = moviesListApi;

  return data;
};

export const getRatedMoviesFromApi = async (page, tokenId) => {
  let moviesData;
  try {
    const ratedMoviesURL = `https://api.themoviedb.org/3/guest_session/${tokenId}/rated/movies?api_key=${API_KEY}&language=en-US&sort_by=created_at.asc&page=${page}`;

    const jsonRatedMovies = await axios.get(ratedMoviesURL);
    moviesData = await jsonRatedMovies.data;
  } catch (e) {
    throw new Error(`${e}, 'Try to refresh the page or try later `);
  }
  return moviesData;
};
