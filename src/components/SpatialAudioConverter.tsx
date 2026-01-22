import { useState } from 'react';
import { Headphones, Loader2 } from 'lucide-react';
import FileUpload from './FileUpload';
import ProgressBar from './ProgressBar';
import AudioControls from './AudioControls';
import { process8DAudio } from '../utils/audioProcessor';
import { useAudioPlayback } from '../hooks/useAudioPlayback';

export default function SpatialAudioConverter() {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);

    const { play, pause, isPlaying } = useAudioPlayback();

    const handleFileSelect = (selectedFile: File) => {
        setFile(selectedFile);
        setProcessedBlob(null);
        setDownloadUrl(null);
        setProgress(0);
    };

    const handleProcess = async () => {
        if (!file) return;

        setIsProcessing(true);
        setProgress(0);

        try {
            const blob = await process8DAudio(file, setProgress);
            const url = URL.createObjectURL(blob);

            setProcessedBlob(blob);
            setDownloadUrl(url);
        } catch (error) {
            console.error('Processing error:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handlePlay = () => {
        if (processedBlob) {
            play(processedBlob);
        }
    };

    const handleDownload = () => {
        if (!downloadUrl || !file) return;

        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `8d_${file.name.replace(/\.[^/.]+$/, '')}.wav`;
        a.click();
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-black rounded-2xl shadow-2xl p-8 border border-cyan-500/20">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-500/10 rounded-xl mb-4 border border-cyan-500/30">
                        <Headphones className="w-8 h-8 text-cyan-400" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2">8D Audio Converter</h1>
                    <p className="text-gray-400">Transform your audio into immersive spatial sound</p>
                </div>

                <div className="space-y-6">
                    <FileUpload onFileSelect={handleFileSelect} fileName={file?.name || null} />

                    {file && !processedBlob && (
                        <button
                            onClick={handleProcess}
                            disabled={isProcessing}
                            className="w-full bg-cyan-500 text-black font-semibold py-4 rounded-xl hover:bg-cyan-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/50"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Processing... {Math.round(progress)}%
                                </>
                            ) : (
                                'Convert to 8D Audio'
                            )}
                        </button>
                    )}

                    {isProcessing && <ProgressBar progress={progress} />}

                    {processedBlob && (
                        <AudioControls
                            onPlay={handlePlay}
                            onPause={pause}
                            onDownload={handleDownload}
                            isPlaying={isPlaying}
                        />
                    )}

                    <div className="mt-10 bg-black p-4 rounded-xl border border-cyan-500/20">
                        <h3 className="text-white font-semibold mb-2 text-center">What is 8D Audio?</h3>
                        <p className="text-gray-400 text-sm text-center">
                            8D audio creates a spatial sound experience where the audio appears to move around your head in a circular motion.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}