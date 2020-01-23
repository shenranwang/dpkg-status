import React from 'react';
import { Route, Link } from 'react-router-dom';
import NoMatchPage from './NoMatchPage'

const Package = ({pkg, pkgs}) => {

    // Show description based on whether data type is string or array (of strings).
    const showDescription = () => {
        const keys = pkg.description.map((line, i) => [line, i])
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
                <p> 
                    {pkg.prev ? <Link to={`/pkg/${pkg.prev}`}>{`<<${pkg.prev}`}</Link> : null}                  
                    <div> </div><Link to={`/`}>Index Page</Link><div> </div>     
                    {pkg.next ? <Link to={`/pkg/${pkg.next}`}>{`${pkg.next}>>`}</Link> : null}
                </p>
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