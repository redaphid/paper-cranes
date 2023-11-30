import React, { useState, useEffect } from 'react';
import { AudioDataProvider, AudioFeatures } from './AudioDataProvider'; // Adjust the import based on your file structure

type AudioVisualizerProps = {
    audioContext: AudioContext;
    audioSource: MediaElementAudioSourceNode;
};

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ audioContext, audioSource }) => {
    const [audioFeatures, setAudioFeatures] = useState<AudioFeatures | null>(null);

    useEffect(() => {
        const features = ['amplitudeSpectrum', 'rms']; // Define the features you need
        const provider = new AudioDataProvider(audioContext, audioSource, features, setAudioFeatures);

        provider.start();

        return () => {
            provider.stop();
        };
    }, [audioContext, audioSource]);

    return (
        <div>
            {audioFeatures && (
                <div>
                    {/* Render your visualization based on audioFeatures here */}
                    RMS: {audioFeatures.rms}
                    {/* More visualizations */}
                </div>
            )}
        </div>
    );
};

export default AudioVisualizer;
