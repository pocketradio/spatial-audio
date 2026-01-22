import { Upload } from 'lucide-react';

interface FileUploadProps {
    onFileSelect: (file: File) => void;
    fileName: string | null;
}

export default function FileUpload({ onFileSelect, fileName }: FileUploadProps) {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('audio/')) {
            onFileSelect(file);
        }
    };

    return (
        <div className="relative">
            <input
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="hidden"
                id="audio-upload"
            />
            <label
                htmlFor="audio-upload"
                className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-cyan-500/30 rounded-xl cursor-pointer bg-cyan-500/5 hover:bg-cyan-500/10 hover:border-cyan-500/50 transition-all"
            >
                <Upload className="w-12 h-12 text-cyan-400 mb-3" />
                <span className="text-white font-medium">
                    {fileName || 'Click to upload audio file'}
                </span>
                <span className="text-gray-500 text-sm mt-1">MP3, WAV, or any audio format</span>
            </label>
        </div>
    );
}