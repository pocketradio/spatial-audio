import { Play, Pause, Download } from 'lucide-react';

interface AudioControlsProps {
    onPlay: () => void;
    onPause: () => void;
    onDownload: () => void;
    isPlaying: boolean;
}

export default function AudioControls({ onPlay, onPause, onDownload, isPlaying }: AudioControlsProps) {
    return (
        <div className="space-y-4 bg-black p-6 rounded-xl border border-cyan-500/30 shadow-lg shadow-cyan-500/10">
            <div className="flex items-center justify-between">
                <span className="text-white font-medium">8D Audio Ready :)</span>
                <div className="flex gap-3">
                    <button
                        onClick={isPlaying ? onPause : onPlay}
                        className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-2 rounded-lg transition-all font-medium shadow-lg shadow-cyan-500/30"
                    >
                        {isPlaying ? (
                            <>
                                <Pause className="w-4 h-4" />
                                Pause
                            </>
                        ) : (
                            <>
                                <Play className="w-4 h-4" />
                                Preview
                            </>
                        )}
                    </button>
                    <button
                        onClick={onDownload}
                        className="flex items-center gap-2 bg-black hover:bg-gray-900 text-cyan-400 px-4 py-2 rounded-lg transition-all font-medium border border-cyan-500/30"
                    >
                        <Download className="w-4 h-4" />
                        Download
                    </button>
                </div>
            </div>
            <p className="text-gray-400 text-sm">
                Use headphones for best experience *
            </p>
        </div>
    );
}