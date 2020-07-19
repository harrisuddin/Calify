import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import Home from './pages/Home';
import ErrorPage from './pages/ErrorPage';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/error">
          <ErrorPage/>
        </Route>
        <Route path="/">
          <Home/>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
