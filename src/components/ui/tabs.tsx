// Simple button-based tabs replacement
import React from 'react';
import { cn } from '@/lib/utils';

// Root Tabs component - just a container
interface TabsProps {
    value?: string;
    onValueChange?: (value: string) => void;
    children?: React.ReactNode;
    className?: string;
}

export const Tabs = ({ children, className }: TabsProps) => {
    return <div className={cn('space-y-4', className)}>{children}</div>;
};

// TabsList component - flex container for buttons
interface TabsListProps {
    children?: React.ReactNode;
    className?: string;
}

export const TabsList = ({ children, className }: TabsListProps) => {
    return (
        <div className={cn('flex flex-wrap gap-2', className)}>
            {children}
        </div>
    );
};
TabsList.displayName = 'TabsList';

// TabsTrigger component - actual button with active state
interface TabsTriggerProps {
    value: string;
    children?: React.ReactNode;
    className?: string;
    onClick?: () => void;
    active?: boolean; // New prop to indicate active state
}

export const TabsTrigger = ({ children, className, onClick, active }: TabsTriggerProps) => {
    return (
        <button
            onClick={onClick}
            data-state={active ? 'active' : 'inactive'}
            className={cn(
                'px-12 py-3 rounded-full border transition-all',
                'text-sm font-medium',
                // Default state - white background
                !active && 'border-gray-200 bg-white text-gray-700',
                !active && 'hover:border-emerald-400 hover:bg-emerald-50',
                // Active state - emerald background
                active && 'bg-emerald-500 border-emerald-500 text-white shadow-md',
                active && 'hover:bg-emerald-600 hover:border-emerald-600',
                className
            )}
        >
            <div className="flex items-center gap-2">
                {children}
            </div>
        </button>
    );
};
TabsTrigger.displayName = 'TabsTrigger';

// TabsContent component
export const TabsContent = ({ children }: { children?: React.ReactNode }) => {
    return <>{children}</>;
};

export type { TabsProps };

// Explicit default export for better module resolution
export default { Tabs, TabsList, TabsTrigger, TabsContent };
