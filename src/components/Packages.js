import React, { useState } from 'react';
import { Link } from "react-router-dom";

/**
 * Renders input field based on which we can filter 
 * packages we want to be visible on the index page.
 * 
 * @param {String} filter - State of useState hook in component Packages.
 * @param {Function} handleFilterChange - Reference to update function of useState hook in component Packages.
 */
const Filter = ({filter, handleFilterChange}) => 
    <div>Find: <input value={filter} onChange={handleFilterChange}></input></div>

/**
 * Renders index page if fetching data from api was successful.
 * Outputs list of all packages in fetched file, providing 
 * links to all of them for more information.
 * 
 * @param {Map<Object>} pkgs - Map of package name (key) to corresponding object (value).
 */
const Packages = ({pkgs}) => {
    const [filter, setFilter] = useState('')

    const handleFilterChange = (event) => setFilter(event.target.value)

    const show = () => {
        return pkgs.filter(pkg => pkg.package.includes(filter.toLowerCase()))
    }

    return (
        <div>
            <h1>Index Page</h1>
            <h2>Contents of file /var/lib/dpkg/status</h2>
            <p>There are {pkgs.length} packages total</p>
            <Filter filter={filter} handleFilterChange={handleFilterChange}/>
            {show().map(pkg =>           
                <p key={pkg.package}>
                    <Link to={`/pkg/${pkg.package}`}>{pkg.package}</Link>
                </p>
            )}
        </div>
    )
}

export default Packages;