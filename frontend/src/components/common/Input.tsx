import {
    forwardRef,
    useState,
    type InputHTMLAttributes,
    type ReactNode,
} from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    showPasswordToggle?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            error,
            hint,
            leftIcon,
            rightIcon,
            showPasswordToggle = false,
            type = 'text',
            className = '',
            id,
            ...props
        },
        ref
    ) => {
        const [showPassword, setShowPassword] = useState(false);
        const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

        const inputType =
            type === 'password' && showPasswordToggle
                ? showPassword
                    ? 'text'
                    : 'password'
                : type;

        const hasError = !!error;

        return (
            <div className={`flex flex-col gap-1.5 ${className}`}>
                {label && (
                    <label
                        htmlFor={inputId}
                        className="text-sm font-medium text-slate-200"
                    >
                        {label}
                    </label>
                )}
                <div
                    className={`
            relative flex items-center
            bg-slate-900/60 border rounded-lg
            transition-all duration-200
            ${hasError ? 'border-red-500' : 'border-white/10'}
            focus-within:border-indigo-500
            ${hasError ? 'focus-within:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]' : 'focus-within:shadow-[0_0_0_3px_rgba(99,102,241,0.15)]'}
          `}
                >
                    {leftIcon && (
                        <span className="absolute left-3 flex items-center justify-center text-slate-500">
                            {leftIcon}
                        </span>
                    )}
                    <input
                        ref={ref}
                        id={inputId}
                        type={inputType}
                        className={`
              flex-1 py-2.5 px-3.5 text-base text-slate-200
              bg-transparent border-none outline-none font-inherit
              placeholder:text-slate-500
              ${leftIcon ? 'pl-10' : ''}
              ${rightIcon || showPasswordToggle ? 'pr-10' : ''}
            `}
                        {...props}
                    />
                    {type === 'password' && showPasswordToggle && (
                        <button
                            type="button"
                            className="absolute right-3 flex items-center justify-center p-1 bg-transparent border-none cursor-pointer text-slate-500 hover:text-slate-400 transition-colors"
                            onClick={() => setShowPassword(!showPassword)}
                            tabIndex={-1}
                        >
                            {showPassword ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="w-5 h-5"
                                >
                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                    <line x1="1" y1="1" x2="23" y2="23" />
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="w-5 h-5"
                                >
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                            )}
                        </button>
                    )}
                    {rightIcon && !showPasswordToggle && (
                        <span className="absolute right-3 flex items-center justify-center text-slate-500">
                            {rightIcon}
                        </span>
                    )}
                </div>
                {error && <span className="text-xs text-red-500">{error}</span>}
                {hint && !error && <span className="text-xs text-slate-500">{hint}</span>}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
