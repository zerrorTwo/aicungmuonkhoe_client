// Wrapper for Ant Design Select to maintain Radix UI-like API
import { Select as AntSelect } from 'antd';
import type { SelectProps as AntSelectProps } from 'antd';
import React from 'react';

// Main Select component that accepts both Radix-style and Ant Design props
interface SelectProps extends Omit<AntSelectProps, 'onChange'> {
    value?: string;
    onValueChange?: (value: string) => void;
    onChange?: (value: string) => void;
    children?: React.ReactNode;
}

export const Select = ({ value, onValueChange, onChange, children, ...props }: SelectProps) => {
    const handleChange = (val: string) => {
        if (onValueChange) onValueChange(val);
        if (onChange) onChange(val);
    };

    return (
        <AntSelect value={value} onChange={handleChange} {...props}>
            {children}
        </AntSelect>
    );
};

// These are just pass-through components for compatibility
export const SelectTrigger = ({ children }: { children?: React.ReactNode; className?: string }) => <>{children}</>;
export const SelectValue = () => null; // Ant Design handles this internally
export const SelectContent = ({ children }: { children?: React.ReactNode; className?: string }) => <>{children}</>;
export const SelectItem = AntSelect.Option;

export type { SelectProps };
