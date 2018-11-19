import React from 'react';

import { Link } from 'react-router-dom';

const Header = () => (
  <header>
    <Link className="vacation-tracker-title" to="/">Vacation Tracker</Link>
  </header>
);

export default Header;
