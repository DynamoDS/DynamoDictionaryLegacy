import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory, IndexRedirect } from 'react-router';



import App from './App';
import './index.css';

ReactDOM.render(
  <Router history={hashHistory} >
    <Route path="/" component={App}>
      <Route path="/:catA" component={ App } />
      <Route path="/:catA/:catB" component={ App } />
      <Route path="/:catA/:catB/:catC" component={ App } />
      <Route path="/:catA/:catB/:catC/:catD" component={ App } />
      <Route path="/:catA/:catB/:catC/:catD/:catE" component={ App } />
      <Route path="/search/:searchVal" component={ App } />

    </Route>
  </Router>,
  document.getElementById('root')
);
