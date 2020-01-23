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

/**
 * Find adjacent packages for navigation purposes.
 * Returns array of packages as JSON objects with adjacents added to them.
 * 
 * @param {Array<Object>} pkgs - Array of packages as JSON objects.
 */
const findAdjacents = (pkgs) => {
  return pkgs.map((obj, i) => {
    let adj = obj
    const prev = pkgs[i - 1]
    const next = pkgs[i + 1]
    if (prev) adj.prev = prev.package
    if (next) adj.next = next.package
    return adj
  })
}

/**
 * Fit key-value pairs into one object. 
 * Takes into consideration fields with multiple lines.
 * Returns a package as a JSON object.
 * 
 * @param {Array<String>} lines - Array of strings that make up the data of one package.
 */
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

/**
 * Alternate dependencies on one line, 
 * versions removed and dependencies separated by |.
 * 
 * @param {String} dep - Alternate dependencies on one line separated by |.
 */
const formatAlternates = (dep) => {
  return dep.split('| ').map(alt => (alt.indexOf(' (') > -1) ? alt.substring(0, alt.indexOf(' ')) : alt).join(' | ')
}

/**
 * Reformat depends field of a package from string to
 * array, and add reverse-depends field to object.
 * Returns package as a JSON object.
 * 
 * @param {Object} pkg - Package as a JSON object.
 */
const formatDependencies = (pkg) => {
  if (pkg.depends === undefined) {
    pkg.depends = [];
  } else if (pkg.depends.indexOf(',') > -1) {
    let tmp = pkg.depends.split(', ');
    tmp = tmp.map(dep => {
      if (dep.indexOf(' (') > -1) {
        if (dep.indexOf('|') > -1) {
          return formatAlternates(dep)
        } else {
          return dep.substring(0, dep.indexOf(' '))
        }
      } else {
        return dep
      }
    });
    pkg.depends = Array.from(new Set(tmp));
  } else {
    pkg.depends.indexOf(' ') > -1 
      ? pkg.depends = [pkg.depends.substring(0, pkg.depends.indexOf(' '))]
      : pkg.depends = [pkg.depends];
  };
  pkg['reverse-depends'] = [];
  return pkg;
};

/**
 * Add the package as a reverse dependency 
 * in packages dependent on it.
 * Returns modified map of pkgMap.
 * 
 * @param {Map<Object>} pkgMap - Map of package name (key) to corresponding object (value).
 */
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

const App = () => {

  const [packages, setPackages] = useState(new Map());
  const [fetchState, setFetchState] = useState(FetchStates.FETCHING)

  const pkgById = (name) => Array.from(packages.values()).find(p => p.package === name);

  // Split each string in array into arrays by new line and
  // turn related data into JSON object.
  const objectify = useCallback((pkg) => {
    return toObject(pkg.split("\n").map(line => line.split(": ")));
  }, []);

  // Organize data into object format.
  const organizePackages = useCallback((content) => {
    // Sort data into array by empty line and 
    // remove empty string in final element of array.
    // Turn into JSON object.
    // Turn depends field from string to array.
    let pkgs = content
      .split("\n\n").slice(0, -1).sort()
      .map(pkg => objectify(pkg))
      .map(pkg => formatDependencies(pkg));

    // Find and add alphabetically adjacent packages to the object. 
    pkgs = findAdjacents(pkgs)

    // Turn into map with name of package (key) and JSON object (value).
    let pkgMap = new Map(pkgs.map(pkg => [pkg.package, pkg]));

    // Add reverse dependencies and turn back into array.
    pkgMap = addReverseDependencies(pkgMap);

    return pkgMap;
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
            <Route exact path='/' render={() =><Packages pkgs={Array.from(packages.values())}/>} />
            <Route exact path='/pkg/:name' render={({ match }) =>
              <Package pkg={pkgById(match.params.name)} pkgs={packages} />}
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
