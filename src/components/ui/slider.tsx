import React from 'react';

interface SliderProps {
    min: number;
    max: number;
    step: number;
    value: number;
    onChange: (value: number) => void;
    className?: string;
}

export const Slider: React.FC<SliderProps> = ({
    min,
    max,
    step,
    value,
    onChange,
    className = ''
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(Number(e.target.value));
    };

    return (
        <div className={`relative ${className}`}>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={handleChange}
                className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer
                   [&::-webkit-slider-thumb]:appearance-none 
                   [&::-webkit-slider-thumb]:h-5 
                   [&::-webkit-slider-thumb]:w-5 
                   [&::-webkit-slider-thumb]:bg-blue-600 
                   [&::-webkit-slider-thumb]:rounded-full 
                   [&::-webkit-slider-thumb]:cursor-pointer
                   [&::-moz-range-thumb]:h-5 
                   [&::-moz-range-thumb]:w-5 
                   [&::-moz-range-thumb]:bg-blue-600 
                   [&::-moz-range-thumb]:rounded-full 
                   [&::-moz-range-thumb]:cursor-pointer 
                   [&::-moz-range-thumb]:border-0"
            />
        </div>
    );
};