export interface AudioFile {
    file: File;
    name: string;
}

export interface AudioProcessingState {
    isProcessing: boolean;
    progress: number;
    processedBlob: Blob | null;
    downloadUrl: string | null;
}

export interface AudioPlaybackState {
    isPlaying: boolean;
}

declare global {
    interface Window {
        webkitAudioContext: typeof AudioContext;
    }
}

export { };