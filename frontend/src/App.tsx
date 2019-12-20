import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import Selection from './Selection';
import Signup from './Signup';
import './App.css';

const App: React.FC = () => {
return (
    <Router>
      <div>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/:id([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})">
            <Selection />
          </Route>
          <Route path="/">
            <Signup />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
