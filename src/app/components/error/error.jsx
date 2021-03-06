import React from 'react';
import PropTypes from 'prop-types';

import errorImage from './__image/error__image.svg';

const Error = props => {
  const { status, info } = props;

  return (
    <div className={b('error', props)}>
      {
        status && (
          <p className="error__status">Error {status}</p>
        )
      }

      <p className="error__info">{info}</p>

      <img
        className="error__image"
        role="presentation"
        alt="Confused robot"
        src={errorImage}
      />
    </div>
  );
};

Error.propTypes = {
  status: PropTypes.number,
  info: PropTypes.string,
};

export default Error;
