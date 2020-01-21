import React from 'react';

const NoMatchPage = ({message}) => {
    return (
        <>
            <h3>404 - Not Found</h3>
            <div>{message}</div>
        </>
    );
};

export default NoMatchPage