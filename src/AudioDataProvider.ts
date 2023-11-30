import Meyda from 'meyda';

export type AudioFeatures = {
    amplitudeSpectrum: Float32Array;
    rms: number;
};

type FeatureCallback = (features: AudioFeatures) => void;

export class AudioDataProvider {
    private meydaAnalyzer: Meyda.MeydaAnalyzer;

    constructor(audioContext: AudioContext, audioSource: MediaElementAudioSourceNode, features: string[], callback: FeatureCallback) {
        this.meydaAnalyzer = Meyda.createMeydaAnalyzer({
            audioContext: audioContext,
            source: audioSource,
            bufferSize: 512,
            featureExtractors: features,
            callback: callback
        });
    }

    start(): void {
        this.meydaAnalyzer.start();
    }

    stop(): void {
        this.meydaAnalyzer.stop();
    }
}

// Usage
const audioContext = new AudioContext();
// Assume audioSource is already defined
const provider = new AudioDataProvider(audioContext, audioSource, ['amplitudeSpectrum', 'rms'], (features) => {
    // Update your components with the new data
});

provider.start();
