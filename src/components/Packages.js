import React, { useState } from 'react';
import { Link } from "react-router-dom";

const Filter = ({newFilter, handleFilterChange}) => 
    <div>Find: <input value={newFilter} onChange={handleFilterChange}></input></div>

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
            <Filter newFilter={filter} handleFilterChange={handleFilterChange}/>
            {show().map(pkg =>           
                <p key={pkg.package}>
                    <Link to={`/pkg/${pkg.package}`}>{pkg.package}</Link>
                </p>
            )}
        </div>
    )
}

export default Packages;