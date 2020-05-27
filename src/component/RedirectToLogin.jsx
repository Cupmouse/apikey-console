import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

function RedirectIfNotLoggedIn(props) {
  const customerKeyStr = localStorage.getItem('customerKey');
  const { reportNotLoggedIn } = props;

  return customerKeyStr === null || reportNotLoggedIn ? (
    <Redirect to="/" />
  ) : '';
}

RedirectIfNotLoggedIn.propTypes = {
  reportNotLoggedIn: PropTypes.bool,
};

RedirectIfNotLoggedIn.defaultProps = {
  reportNotLoggedIn: false,
};

export default RedirectIfNotLoggedIn;
