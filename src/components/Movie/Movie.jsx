import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Rate } from 'antd';

import movie from './Movie.module.css';
import movieImageIsNotFound from '../../assets/images/movieImageIsNotFound.png';
import { rateMovie } from '../../services/services';

function Movie(props) {
  const {
    backgroundImage,
    title,
    description,
    releaseDate,
    voteAverage,
    id,
    rating,
    genres,
    tokenId,
  } = props;

  const voteAverageModified = Number(voteAverage.toString().slice(0, 3));
  const imageURL = `https://image.tmdb.org/t/p/original/${backgroundImage}`;

  let styledVoteAverage;

  if (voteAverageModified > 3 && voteAverageModified <= 5) {
    styledVoteAverage = '#E97E00';
  } else if (voteAverageModified > 5 && voteAverageModified <= 7) {
    styledVoteAverage = '#E9D100';
  } else if (voteAverageModified > 7) {
    styledVoteAverage = '#66E900';
  } else {
    styledVoteAverage = '#E90000';
  }

  return (
    <MovieCards>
      <MovieImage src={backgroundImage ? imageURL : movieImageIsNotFound} />
      <MovieDetails>
        <CardHeader>
          <MovieTitle>{title.split(' ').slice(0, 1).join(' ')}</MovieTitle>
          <RatingNumber style={{ border: `3px solid ${styledVoteAverage}` }}>
            {voteAverageModified}
          </RatingNumber>
        </CardHeader>
        <MovieDate>{releaseDate}</MovieDate>
        <MovieCategory>
          {genres.map((genre) => (
            <Genre key={genre}>{genre}</Genre>
          ))}
        </MovieCategory>
        <MovieDescription>
          {description.split(' ').slice(0, 20).join(' ')}
          ...
        </MovieDescription>
        <Rate
          className={movie.rateMovie}
          allowHalf
          defaultValue={rating}
          count={10}
          onChange={(ratingNum) => rateMovie(id, ratingNum, tokenId)}
        />
      </MovieDetails>
    </MovieCards>
  );
}

Movie.propTypes = {
  backgroundImage: PropTypes.string,
  voteAverage: PropTypes.number,
  releaseDate: PropTypes.string,
  description: PropTypes.string,
  title: PropTypes.string,
  id: PropTypes.number,
  rating: PropTypes.number,
  genres: PropTypes.arrayOf(PropTypes.string),
  tokenId: PropTypes.string,
};

Movie.defaultProps = {
  voteAverage: 0,
  backgroundImage: '',
  releaseDate: '',
  description: '',
  title: '',
  id: null,
  rating: null,
  genres: [''],
  tokenId: '',
};

const MovieCards = styled.div`
  @media only screen and (min-width: 421px) and (max-width: 767px) {
    max-width: 320px;
    width: 387px;
    margin: 32px 35px 0 5%;
  }
  width: 454px;
  height: 281px;
  position: relative;
  display: flex;
  align-items: center;
  box-shadow: 4px 4px 5px 0 rgba(212, 212, 212, 1);
  margin: 32px -5px 0 36px;
`;

const CardHeader = styled.header`
  @media only screen and (min-width: 421px) and (max-width: 767px) {
    display: flex;
    width: auto;
  }
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 255px;
`;

const MovieDetails = styled.div`
  @media only screen and (min-width: 421px) and (max-width: 767px) {
    width: 251px;
    margin: -60px 0 0 10px;
  }

  @media only screen and (min-width: 768px) {
    margin: 9px 0;
    width: 271px;
    padding-left: 9px;
  }
`;

const MovieImage = styled.img`
  @media only screen and (min-width: 421px) and (max-width: 767px) {
    width: 60px;
    height: 91px;
    margin: -170px 0 0 10px;
  }

  @media only screen and (min-width: 768px) {
    width: 183px;
    height: 281px;
  }
`;

const MovieTitle = styled.h1`
  @media only screen and (min-width: 421px) and (max-width: 767px) {
    font-size: 20px;
  }

  @media only screen and (min-width: 768px) {
    font-size: 20px;
    margin-top: 12px;
    width: 200px;
  }
`;

const RatingNumber = styled.h4`
  @media only screen and (min-width: 421px) and (max-width: 767px) {
    margin-top: -1px;
  }
  height: 30px;
  width: 30px;
  background-color: white;
  border-radius: 50%;
  display: block;
  text-align: center;
  padding-top: 4.5px;
  font-size: 12px;
  margin: 12px 9px 0 0;
`;

const MovieDate = styled.h4`
  font-size: 12px;
  margin-top: 7px;
`;

const MovieCategory = styled.div`
  margin: 9px -5px;
  height: auto;
`;

const MovieDescription = styled.p`
  font-size: 12px;
  margin-top: 10px;
  margin-right: 5px;
  line-height: 22px;
  flex-wrap: wrap;
`;

const Genre = styled.span`
  display: inline-block;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.65);
  background-color: rgba(250, 250, 250, 1);
  height: 20px;
  width: auto;
  border-radius: 2px;
  margin-top: 6px;
  margin-left: 7px;
  padding: 1px 4px;
`;

export default Movie;
