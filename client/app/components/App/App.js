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

class App extends Component {


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
