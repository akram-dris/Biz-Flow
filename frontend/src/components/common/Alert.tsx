import type { ReactNode } from 'react';

export interface AlertProps {
    variant?: 'info' | 'success' | 'warning' | 'error';
    title?: string;
    children: ReactNode;
    onClose?: () => void;
    className?: string;
}

const variantStyles = {
    info: {
        container: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
        icon: 'text-blue-500',
        title: 'text-blue-200',
    },
    success: {
        container: 'bg-green-500/10 border-green-500/30 text-green-300',
        icon: 'text-green-500',
        title: 'text-green-200',
    },
    warning: {
        container: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
        icon: 'text-amber-500',
        title: 'text-amber-200',
    },
    error: {
        container: 'bg-red-500/10 border-red-500/30 text-red-300',
        icon: 'text-red-500',
        title: 'text-red-200',
    },
};

const icons = {
    info: (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
    ),
    success: (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    ),
    warning: (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
    ),
    error: (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
    ),
};

export function Alert({
    variant = 'info',
    title,
    children,
    onClose,
    className = '',
}: AlertProps) {
    const styles = variantStyles[variant];

    return (
        <div
            className={`flex gap-3 p-4 rounded-lg border ${styles.container} ${className}`}
        >
            <span className={`flex-shrink-0 w-5 h-5 ${styles.icon}`}>
                {icons[variant]}
            </span>
            <div className="flex-1 min-w-0">
                {title && (
                    <h4 className={`m-0 mb-1 text-sm font-semibold ${styles.title}`}>
                        {title}
                    </h4>
                )}
                <div className="text-sm leading-relaxed">{children}</div>
            </div>
            {onClose && (
                <button
                    type="button"
                    className="flex-shrink-0 flex items-center justify-center w-6 h-6 p-0 bg-transparent border-none rounded cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
                    onClick={onClose}
                    aria-label="Close alert"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4"
                    >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            )}
        </div>
    );
}

export default Alert;
