import React from 'react';
import { render } from 'react-dom';

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Link,
  Switch
} from 'react-router-dom'

import App from './components/App/App';

import Login from './components/Login/Login';
import NotFound from './components/App/NotFound';
import Home from './components/Home/Home';
import HelloWorld from './components/HelloWorld/HelloWorld';
import './styles/styles.scss';

render((
      <Router>
        <App>
            <Switch>
              <Route exact path="/" component={Login}/>
              <Route exact path="/admin" component={Home}/>
              <Route component={NotFound}/>
            </Switch>
        </App>
      </Router>
), document.getElementById('app'));
