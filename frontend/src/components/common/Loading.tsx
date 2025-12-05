export interface LoadingProps {
    size?: 'sm' | 'md' | 'lg';
    fullScreen?: boolean;
    text?: string;
}

const sizeStyles = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
};

const ringStyles = {
    sm: 'border-2',
    md: 'border-3',
    lg: 'border-4',
};

export function Loading({ size = 'md', fullScreen = false, text }: LoadingProps) {
    const spinner = (
        <div className={`relative ${sizeStyles[size]}`}>
            <div
                className={`absolute inset-0 border-transparent border-t-indigo-500 rounded-full animate-spin ${ringStyles[size]}`}
            />
            <div
                className={`absolute inset-1 border-transparent border-t-purple-400 rounded-full animate-spin-slow ${ringStyles[size]}`}
                style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
            />
            <div
                className={`absolute inset-2 border-transparent border-t-violet-300 rounded-full animate-spin ${ringStyles[size]}`}
                style={{ animationDuration: '2s' }}
            />
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur z-[9999] gap-4">
                {spinner}
                {text && <p className="m-0 text-sm text-slate-400">{text}</p>}
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center gap-3 p-8">
            {spinner}
            {text && <p className="m-0 text-sm text-slate-400">{text}</p>}
        </div>
    );
}

export default Loading;
