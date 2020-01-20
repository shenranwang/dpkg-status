import React, { useEffect, useState } from 'react';
import './App.css';

const App = () => {

  const [url, setUrl] = useState('');
  const [packages, setPackages] = useState([]);

  const intoObject = (pkg) => {
    return pkg
    return pkg.reduce((prev, curr) => {
      /* console.log(prev, curr) */
      prev[curr[0].toLowerCase()] = curr[1];
      return prev;
    }, {});
  } 

  // Organize data into object format.
  const organizePackages = (content) => {
    // Sort data into array by empty line,
    // remove empty string in final element of array,
    // Split each string in array into arrays by new line,
    let arr = content
      .split("\n\n")
      .slice(0, -1)
/*       .map(pkg => pkg.split("\n").map(line => line.split(": "))) */

    console.log(arr, typeof arr)
    // TODO: Name, Description, Depends, Reverse dependencies
    return arr;
  };

  // Fetch sample file data through GitHub Gists API.
  const getData = async () => {
    await fetch('https://api.github.com/gists/29735158335170c27297422a22b48caa')
      .then(results => {
        return results.json();
      })
      .then(data => {
        setUrl(data.url);
        console.log(packages)
        setPackages(organizePackages(data.files["status.real"].content));
        console.log(packages)
      });
/*     await fetch('public/status.real')
      .then(results => {
        return results.json();
      })
      .then(data => {
        setPackages(organizePackages(data));
      }); */
  };

  useEffect(() => {
    getData();
  }, []);

/*   return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <p>
          Url is {url}.
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
  ) */
  return (
    <div>
      <h1>Index Page</h1>
      <h2>Contents of file /var/lib/dpkg/status</h2>
      <p>Url is {url}</p>
        <p>There are {packages.length} packages total</p>
      <div>{}</div>
    </div>
  );
};

export default App;
