// import React, { Component } from 'react';
//
// import Header from '../Header/Header';
//
// const App = ({ children }) => (
//   <>
//     <Header />
//
//     <main>
//       {children}
//     </main>
//
//
//   </>
// );
//
// export default App;

import React, { Component } from 'react'
import Header from '../Header/Header';
import PropTypes from 'prop-types';

class App extends Component {
  static propTypes = {
    children: PropTypes.node
  }


render() {
  const { children } = this.props

  return (
    <>
    <Header />
    <main>
      {children}
    </main>
    </>
  )
}
}

export default App
