import type { HTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import styles from './Card.module.css';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    title?: string;
    subtitle?: string;
    footer?: ReactNode;
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = ({
    children,
    title,
    subtitle,
    footer,
    padding = 'md',
    className,
    ...props
}: CardProps) => {
    return (
        <div className={clsx(styles.card, className)} {...props}>
            {(title || subtitle) && (
                <div className={styles.header}>
                    {title && <h3 className={styles.title}>{title}</h3>}
                    {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
                </div>
            )}
            <div className={clsx(styles.content, styles[`padding-${padding}`])}>
                {children}
            </div>
            {footer && <div className={styles.footer}>{footer}</div>}
        </div>
    );
};
