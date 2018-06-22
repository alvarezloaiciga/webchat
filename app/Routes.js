import React from 'react';
import Launcher from 'Launcher';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

const routes = () => (
  <Router>
    <Switch>
      <Route component={Launcher} />
    </Switch>
  </Router>
);
export default routes;
