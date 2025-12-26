import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', hover = false }) => {
    return (
        <div
            className={`bg-white rounded-lg shadow-md overflow-hidden ${hover ? 'transition-transform hover:scale-105 hover:shadow-lg' : ''
                } ${className}`}
        >
            {children}
        </div>
    );
};

export default Card;
