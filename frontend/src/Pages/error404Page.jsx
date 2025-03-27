import React from 'react';
import '../styles/error404Page.scss';

const Error404Page = () => {
    return (
        <div className="error-page">
            <h1 className="error-page__title">404</h1>
            <p className="error-page__message">Oops! The page you are looking for doesn't exist.</p>
            <a href="/" className="error-page__link">Go back to Home</a>
        </div>
    );
};

export default Error404Page;
