import React from 'react';

import { Link } from 'react-router-dom';

const Header = () => (
  <header className="">
    <Link className="vacation-tracker-title white-header" to="/"><h2>Vacation Tracker</h2></Link>
  </header>
);

export default Header;
