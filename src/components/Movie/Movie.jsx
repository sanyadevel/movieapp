/* eslint-disable */
import React from 'react';
import movie from './Movie.module.css';

import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Rate } from 'antd';

function Movie(props) {
  const { backgroundImage, title, description, releaseDate, voteAverage } =
    props;
  const voteAverageModified = Number(voteAverage.toString().slice(0, 3));
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
    <MovieCard>
      <MovieImage src={backgroundImage} />
      <MovieDetails>
        <CardHeader>
          <MovieTitle>{title.split(' ').slice(0, 4).join(' ')}</MovieTitle>
          <RatingNumber style={{ border: `3px solid ${styledVoteAverage}` }}>
            {voteAverageModified}
          </RatingNumber>
        </CardHeader>
        <MovieDate>{releaseDate}</MovieDate>
        <MovieCategory>
          <Action>Action</Action>
          <Drama>Drama</Drama>
        </MovieCategory>
        <MovieDescription>
          {description.split(' ').slice(0, 20).join(' ')}...
        </MovieDescription>
        <Rate
          className={movie.rateMovie}
          allowHalf
          defaultValue={0}
          count={10}
        />
      </MovieDetails>
    </MovieCard>
  );
}

Movie.propTypes = {
  backgroundImage: PropTypes.string,
  voteAverage: PropTypes.number,
  releaseDate: PropTypes.string,
  description: PropTypes.string,
  title: PropTypes.string,
};

Movie.defaultProps = {
  voteAverage: 0,
  backgroundImage: '',
  releaseDate: '',
  description: '',
  title: '',
};

export default Movie;

const MovieCard = styled.div`
  width: 454px;
  height: 281px;
  position: relative;
  display: flex;
  align-items: center;
  box-shadow: 4px 4px 5px 0 rgba(212, 212, 212, 1);
  margin: 32px -5px 0 36px;
`;
const CardHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 255px;
`;
const MovieDetails = styled.div`
  margin: 9px 0;
  width: 271px;
  padding-left: 9px;
`;
const MovieImage = styled.img`
  width: 183px;
  height: 281px;
`;

const MovieTitle = styled.h1`
  font-size: 20px;
  margin-top: 12px;
  width: 200px;
`;
const RatingNumber = styled.h4`
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
  margin-top: 9px;
`;
const MovieDescription = styled.p`
  font-size: 12px;
  margin-top: 10px;
  margin-right: 5px;
  line-height: 22px;
`;
const Action = styled.span`
  font-size: 12px;
  color: rgba(0, 0, 0, 0.65);
  border: 1px solid rgba(217, 217, 217, 1);
  background-color: rgba(250, 250, 250, 1);
  height: 20px;
  width: 46px;
  border-radius: 2px;
  margin-top: 10px;
`;
const Drama = styled(Action)`
  margin-left: 8px;
`;
