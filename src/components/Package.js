import React from 'react';
import { Route, Link } from 'react-router-dom';
import NoMatchPage from './NoMatchPage'

const Package = ({pkg}) => {

    // Show description based on whether data type is string or array (of strings).
    const showDescription = () => {
        return typeof pkg.description === 'string' 
            ? <h3>{pkg.description}</h3>
            :
            <>
                <h3>{pkg.description[0]}</h3>
                {pkg.description.slice(1).map(line => <div key={line}>{line}</div>)}
            </>
    }

    return (
        pkg ? <Route path={`/pkg/${pkg.package}`}>
                <h1>{pkg.package}</h1>
                <h2>Description</h2>
                {showDescription()}
                <h2>Dependencies</h2>
                {pkg.depends.map(dep => <p key={dep}><Link to={`/pkg/${dep}`}>{dep}</Link></p>)}
                <h2>Reverse Dependencies</h2>
                {pkg['reverse-depends'].map(dep => <p key={dep}><Link to={`/pkg/${dep}`}>{dep}</Link></p>)}
            </Route>      
            : <NoMatchPage message="Package does not exist in /var/lib/dpkg/status."/>      
    )
};

export default Package;