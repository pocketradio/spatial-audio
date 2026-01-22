import { useRef, useState } from 'react';


export function useAudioPlayback() {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioContextRef = useRef<AudioContext | null>(null);
    const sourceRef = useRef<AudioBufferSourceNode | null>(null);
    const pannerRef = useRef<PannerNode | null>(null);
    const animationRef = useRef<number | null>(null);

    const play = async (blob: Blob) => {
        try {
            const arrayBuffer = await blob.arrayBuffer();

            if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
                audioContextRef.current = new AudioContext();
            }

            const audioContext = audioContextRef.current;
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

            const source = audioContext.createBufferSource();
            source.buffer = audioBuffer;

            const panner = audioContext.createPanner();
            panner.panningModel = 'HRTF';
            panner.distanceModel = 'linear';

            const gain = audioContext.createGain();

            source.connect(panner);
            panner.connect(gain);
            gain.connect(audioContext.destination);

            sourceRef.current = source;
            pannerRef.current = panner;

            source.start(0);
            setIsPlaying(true);

            const startTime = audioContext.currentTime;
            const animate = () => {
                if (!pannerRef.current) return;

                const elapsed = audioContext.currentTime - startTime;
                const angle = elapsed * 0.5 * Math.PI * 2;
                const radius = 2;

                pannerRef.current.positionX.setValueAtTime(Math.cos(angle) * radius, audioContext.currentTime);
                pannerRef.current.positionY.setValueAtTime(0, audioContext.currentTime);
                pannerRef.current.positionZ.setValueAtTime(Math.sin(angle) * radius, audioContext.currentTime);

                animationRef.current = requestAnimationFrame(animate);
            };

            animate();

            source.onended = () => {
                setIsPlaying(false);
                if (animationRef.current) {
                    cancelAnimationFrame(animationRef.current);
                }
            };
        } catch (error) {
            console.error('Playback error:', error);
            setIsPlaying(false);
        }
    };

    const pause = () => {
        if (sourceRef.current) {
            sourceRef.current.stop();
            sourceRef.current = null;
        }
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }
        setIsPlaying(false);
    };

    return { play, pause, isPlaying };
}