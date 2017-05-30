import React from 'react';
import Launcher from 'Launcher';
import ChatContainer from 'ChatContainer';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

const routes = () => (
  <Router>
    <Switch>
      <Route exact path="/app/webchat/standalone" component={ChatContainer} />
      <Route component={Launcher} />
    </Switch>
  </Router>
);
console.log(routes);
export default routes;
