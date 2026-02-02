import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes } from 'react';
import clsx from 'clsx';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, helperText, fullWidth, id, ...props }, ref) => {
        const generatedId = useId();
        const inputId = id || generatedId;

        return (
            <div className={clsx(styles.container, { [styles.fullWidth]: fullWidth }, className)}>
                {label && (
                    <label htmlFor={inputId} className={styles.label}>
                        {label}
                    </label>
                )}
                <div className={styles.inputWrapper}>
                    <input
                        id={inputId}
                        ref={ref}
                        className={clsx(styles.input, { [styles.hasError]: !!error })}
                        aria-invalid={!!error}
                        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
                        {...props}
                    />
                </div>

                {error ? (
                    <span id={`${inputId}-error`} className={styles.errorMessage} role="alert">
                        {error}
                    </span>
                ) : helperText ? (
                    <span id={`${inputId}-helper`} className={styles.helperText}>
                        {helperText}
                    </span>
                ) : null}
            </div>
        );
    }
);

Input.displayName = 'Input';
