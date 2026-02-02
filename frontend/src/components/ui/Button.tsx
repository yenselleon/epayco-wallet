import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';
import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, fullWidth, children, disabled, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={clsx(
                    styles.button,
                    styles[variant],
                    styles[size],
                    {
                        [styles.fullWidth]: fullWidth,
                        [styles.loading]: isLoading,
                    },
                    className
                )}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading && <span className={styles.spinner} aria-hidden="true" />}
                <span className={styles.content}>{children}</span>
            </button>
        );
    }
);

Button.displayName = 'Button';
