import React from 'react';
import Launcher from 'Launcher';
import CompatibilityWrapper from 'CompatibilityWrapper';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

const routes = () =>
  <Router>
    <CompatibilityWrapper>
      <Switch>
        <Route component={Launcher} />
      </Switch>
    </CompatibilityWrapper>
  </Router>;
export default routes;
