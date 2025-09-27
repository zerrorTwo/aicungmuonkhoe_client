import React from 'react';

const HealthLogo: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => {
    return (
        <div className={`${className} bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-xl`}>
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
            >
                <path
                    d="M19 14C19.74 14 20.38 14.37 20.76 14.97C21.15 15.57 21.15 16.31 20.76 16.91L20.35 17.68C19.96 18.28 19.31 18.65 18.56 18.65H5.44C4.69 18.65 4.04 18.28 3.65 17.68L3.24 16.91C2.85 16.31 2.85 15.57 3.24 14.97C3.62 14.37 4.26 14 5 14V9C5 5.13 8.13 2 12 2S19 5.13 19 9V14Z"
                    fill="currentColor"
                />
                <path
                    d="M12 8V16M8 12H16"
                    stroke="hsl(158 64% 32%)"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
            </svg>
        </div>
    );
};

export default HealthLogo;