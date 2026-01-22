interface ProgressBarProps {
    progress: number;
}

export default function ProgressBar({ progress }: ProgressBarProps) {
    return (
        <div className="w-full bg-gray-900 rounded-full h-2 overflow-hidden border border-cyan-500/20">
            <div
                className="bg-linear-to-r from-cyan-500 to-blue-500 h-full transition-all duration-300 shadow-lg shadow-cyan-500/50"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}