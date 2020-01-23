import React from 'react';
import { Route, Link } from 'react-router-dom';
import NoMatchPage from './NoMatchPage'

/**
 * Renders view of a package, which includes
 * the name of the package, its description,
 * dependencies and reverse dependencies.
 * 
 * @param {Object} pkg - JSON object which contains package data.
 * @param {Map<Object>} pkgs - Map of package name (key) to corresponding object (value).
 */
const Package = ({pkg, pkgs}) => {

    // Show appropriate description based on whether
    // data type is string or array (of strings).
    const showDescription = () => {
        let keys = typeof pkg.description !== 'string' ? pkg.description.map((line, i) => [line, i]) : pkg.description
        return typeof pkg.description === 'string' 
            ? <h3>{pkg.description}</h3>
            :
            <>
                <h3>{pkg.description[0]}</h3>
                {keys.slice(1).map(line => <div key={line[1]}>{line[0]}</div>)}
            </>
    }

    // Link to package if it exists in file.
    const dependentPackages = (dep) => {
        if (dep.indexOf('|') > -1) {
            // Alternate dependecies are on the same line;
            // provides link to one or no packages.
            let valid = dep.split(' | ').find(alt => pkgs.get(alt) !== undefined)
            if (valid) {
                const other = dep.substring(0, dep.indexOf(valid)) + dep.substring(dep.indexOf(valid) + valid.length)
                return <p key={dep}><Link to={`/pkg/${valid}`}>{valid}</Link>{other}</p>
            } else {
                return <p key={dep}>{dep}</p>
            }
        } else {
            return (
                pkgs.get(dep) 
                    ? <p key={dep}><Link to={`/pkg/${dep}`}>{dep}</Link></p>
                    : <p key={dep}>{dep}</p>
            )
        }
    }

    return (
        pkg ? <Route path={`/pkg/${pkg.package}`}>
                <div> 
                    {pkg.prev ? <Link to={`/pkg/${pkg.prev}`}>{`<<${pkg.prev}`}</Link> : null}                  
                    <br></br><Link to={`/`}>Index Page</Link><br></br>
                    {pkg.next ? <Link to={`/pkg/${pkg.next}`}>{`${pkg.next}>>`}</Link> : null}
                </div>
                <h1>{pkg.package}</h1>
                <h2>Description</h2>
                {showDescription()}
                <h2>Dependencies</h2>
                {pkg.depends.map(dep => dependentPackages(dep))}
                <h2>Reverse Dependencies</h2>
                {pkg['reverse-depends'].map(dep => dependentPackages(dep))}
            </Route>      
            : <NoMatchPage message="Package does not exist in /var/lib/dpkg/status."/>      
    )
};

export default Package;