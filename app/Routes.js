import React from 'react';
import Launcher from 'Launcher';
import ChatContainer from 'ChatContainer';
import CompatibilityWrapper from 'CompatibilityWrapper';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

const routes = () => (
  <Router>
    <CompatibilityWrapper>
      <Switch>
        <Route exact path="/app/webchat/standalone" component={ChatContainer} />
        <Route component={Launcher} />
      </Switch>
    </CompatibilityWrapper>
  </Router>
);
console.log(routes);
export default routes;
