import React, { createContext, useState, useCallback, useEffect } from 'react';
import Meyda from 'meyda';

// Define the type for the audio features you'll extract
type AudioFeatures = {
    amplitudeSpectrum: Float32Array;
    rms: number;
    // ... other features as needed
};

// Define the context type
type AudioProviderContextType = {
    audioFeatures: AudioFeatures | null;
    setAudioSource: (source: MediaElementAudioSourceNode) => void;
};

// Create the context
export const AudioProviderContext = createContext<AudioProviderContextType | null>(null);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
    const [audioFeatures, setAudioFeatures] = useState<AudioFeatures | null>(null);
    const [meydaAnalyzer, setMeydaAnalyzer] = useState<Meyda.MeydaAnalyzer | null>(null);

    const initializeAudioContext = () => {
        if (!audioContext) {
            const ac = new AudioContext();
            setAudioContext(ac);
        }
    };

    const setAudioSource = useCallback((source: MediaElementAudioSourceNode) => {
        if (audioContext && source) {
            if (meydaAnalyzer) {
                meydaAnalyzer.stop();
            }

            const analyzer = Meyda.createMeydaAnalyzer({
                audioContext,
                source,
                bufferSize: 512,
                featureExtractors: ['amplitudeSpectrum', 'rms'],
                callback: setAudioFeatures
            });

            analyzer.start();
            setMeydaAnalyzer(analyzer);
        }
    }, [audioContext, meydaAnalyzer]);

    useEffect(() => {
        return () => {
            meydaAnalyzer?.stop();
        };
    }, [meydaAnalyzer]);

    return (
        <AudioProviderContext.Provider value={{ audioFeatures, setAudioSource }}>
            {!audioContext && <button onClick={initializeAudioContext}>Initialize Audio</button>}
            {audioContext && children}
        </AudioProviderContext.Provider>
    );
};
