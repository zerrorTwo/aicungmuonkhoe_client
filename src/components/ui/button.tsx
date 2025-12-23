// Re-export Ant Design Button as custom Button for compatibility
import { Button as AntButton } from 'antd';
import type { ButtonProps as AntButtonProps } from 'antd';
import { cn } from '@/lib/utils';

export interface ButtonProps extends Omit<AntButtonProps, 'type' | 'variant'> {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    asChild?: boolean;
}

export const Button = ({ variant = 'default', className, ...props }: ButtonProps) => {
    // Map custom variants to Ant Design types
    const typeMap = {
        default: 'primary',
        destructive: 'primary',
        outline: 'default',
        secondary: 'default',
        ghost: 'text',
        link: 'link'
    } as const;

    const type = typeMap[variant] || 'primary';
    const danger = variant === 'destructive';

    return (
        <AntButton
            type={type as any}
            danger={danger}
            className={cn(className)}
            {...props}
        />
    );
};

export { AntButton };