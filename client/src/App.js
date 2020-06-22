import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {

  const [list, setList] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {

    let q = new URLSearchParams(window.location.search).get("query") || " ";
    setQuery(q);

    fetch('/api/list')
    .then(res => res.json())
    .then(list => setList(list))
  }, [setList]);


  return (
    <React.Fragment>
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
    <div>
      {query && <h1>{query}</h1>}
      <ul>
        {list.map((elem) => <li key={elem}>{elem}</li>)}
      </ul>
    </div>
    </React.Fragment>
  );
}

export default App;
