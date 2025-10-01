import React from 'react';

interface LogoProps {
    className?: string;
    width?: number;
    height?: number;
    alt?: string;
}

export const Logo: React.FC<LogoProps> = ({
    className = "",
    width = 120,
    height = 60,
    alt = "Ai cũng muốn khỏe"
}) => {
    return (
        <img

            src="/logo.png"
            alt={alt}
            width={width}
            height={height}
            className={`object-contain ${className} rounded-full`}
        />
    );
};

export default Logo;