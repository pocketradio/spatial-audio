import { audioBufferToWav } from './wavEncoder';

export async function process8DAudio(
    file: File,
    onProgress: (progress: number) => void
): Promise<Blob> {
    const arrayBuffer = await file.arrayBuffer();

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    const offlineContext = new OfflineAudioContext(
        2,
        audioBuffer.length,
        audioBuffer.sampleRate
    );

    const source = offlineContext.createBufferSource();
    source.buffer = audioBuffer;

    const panner = offlineContext.createPanner();
    panner.panningModel = 'HRTF';
    panner.distanceModel = 'linear';
    panner.refDistance = 1;
    panner.maxDistance = 10000;
    panner.rolloffFactor = 1;
    panner.coneInnerAngle = 360;
    panner.coneOuterAngle = 0;
    panner.coneOuterGain = 0;

    source.connect(panner);
    panner.connect(offlineContext.destination);

    const radius = 2;
    const rotationsPerSecond = 0.5;
    const sampleRate = audioBuffer.sampleRate;
    const totalSamples = audioBuffer.length;
    const samplesPerUpdate = Math.floor(sampleRate / 60);

    for (let i = 0; i < totalSamples; i += samplesPerUpdate) {
        const time = i / sampleRate;
        const angle = time * rotationsPerSecond * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        panner.positionX.setValueAtTime(x, time);
        panner.positionY.setValueAtTime(0, time);
        panner.positionZ.setValueAtTime(z, time);

        onProgress(Math.min(50, (i / totalSamples) * 50));
    }

    source.start(0);

    const renderedBuffer = await offlineContext.startRendering();
    onProgress(75);

    const wavBlob = audioBufferToWav(renderedBuffer);
    onProgress(100);

    audioContext.close();

    return wavBlob;
}