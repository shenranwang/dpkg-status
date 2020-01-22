import React, { useEffect, useState, useCallback } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Package from './components/Package';
import Packages from './components/Packages';
import NoMatchPage from './components/NoMatchPage'

  const FetchStates = Object.freeze({
    FETCHING: 'FETCHING',
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR'
  });

const App = () => {

  const [packages, setPackages] = useState([]);
  const [fetchState, setFetchState] = useState(FetchStates.FETCHING)

  const pkgById = (name) => packages.find(p => p.package === name);

  // Fit key-value pairs into one object. Takes into consideration fields with multiple lines.
  const toObject = (lines) => {
    let object = {};
    let lastKey;
    for (let i = 0; i < lines.length; ++i) {
      if (lines[i][0][0] === " ") {
        object[lastKey] = [object[lastKey]]
        const line = lines[i][0] === " ." ? "" : lines[i][0]
        object[lastKey] = object[lastKey].concat(line).flat();
      } else {
        lastKey = lines[i][0].toLowerCase();
        object[lastKey] = lines[i][1];
      }
    }
    return object;
  };

  // Split each string in array into arrays by new line and
  // turn related data into JSON object.
  const objectify = useCallback((pkg) => {
    return toObject(pkg.split("\n").map(line => line.split(": ")));
  }, []);

  // Reformat depends field of a package from string to array, and add reverse-depends field to object.
  const formatDependencies = (pkg) => {
    if (pkg.depends === undefined) {
      pkg.depends = [];
    } else if (pkg.depends.indexOf(',') > -1) {
      let tmp = pkg.depends.split(', ');
      tmp = tmp.map(dep => (dep.indexOf(' ') > -1) ? dep.substring(0, dep.indexOf(' ')) : dep);
      pkg.depends = Array.from(new Set(tmp));
    } else {
      pkg.depends.indexOf(' ') > -1 
        ? pkg.depends = [pkg.depends.substring(0, pkg.depends.indexOf(' '))]
        : pkg.depends = [pkg.depends];
    };
    pkg['reverse-depends'] = [];
    return pkg;
  };

  // Add the package as a reverse dependency in packages dependent on it.
  const addReverseDependencies = (pkgMap) => {
    pkgMap.forEach((value, key, map) => {
      value.depends.forEach((pkg) => {
          if (pkg.length !== 0) {
          let object = pkgMap.get(pkg);
          if (object) object['reverse-depends'] = object['reverse-depends'].concat(key);
        }   
      });
    });
    return pkgMap;
  };

  // Organize data into object format.
  const organizePackages = useCallback((content) => {
    // Sort data into array by empty line and remove empty string in final element of array
    // Turn into JSON object
    // Turn depends field from string to array
    let pkgs = content
      .split("\n\n").slice(0, -1).sort()
      .map(pkg => objectify(pkg))
      .map(pkg => formatDependencies(pkg));

    // Turn into map with name of package (key) and JSON object (value)
    // Add reverse dependencies and turn back into array
    let pkgMap = new Map(pkgs.map(pkg => [pkg.package, pkg]));

    pkgs = Array.from(addReverseDependencies(pkgMap).values());

    // TODO: Alternates
    return pkgs;
  }, [objectify]);

  // Fetch sample file data through GitHub Gists API.
  const getData = useCallback(async () => {
    try {
      await fetch('https://api.github.com/gists/29735158335170c27297422a22b48caa')
      .then(results => {
        return results.json();
      })
      .then(data => {
        setPackages(organizePackages(data.files["status.real"].content));
        setFetchState(FetchStates.SUCCESS)
      });
    } catch (error) {
      console.log(error.message)
      setFetchState(FetchStates.ERROR)
    }
    
  }, [organizePackages]);

  useEffect(() => {
    getData();
  }, [getData]);

  if (fetchState === FetchStates.SUCCESS) {
    return (
      <Router>
        <div>
          <Switch>
            <Route exact path='/' render={() =><Packages pkgs={packages}/>} />
            <Route exact path='/pkg/:name' render={({ match }) =>
              <Package pkg={pkgById(match.params.name)}/>}
            />
            <Route component={NoMatchPage} />
          </Switch>
        </div>      
      </Router>
    );
  } else if (fetchState === FetchStates.FETCHING) {
    return <div>Loading...</div>
  } else {
    return <div><NoMatchPage message="Error fetching file!"/></div>
  }

};

export default App;
