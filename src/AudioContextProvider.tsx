// AudioContextProvider.tsx
import React, { createContext, useState, useEffect } from 'react';

export const AudioContextContext = createContext<AudioContext | null>(null);

export const AudioContextProvider: React.FC = ({ children }) => {
    const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

    useEffect(() => {
        const ac = new AudioContext();
        setAudioContext(ac);

        return () => {
            ac.close();
        };
    }, []);

    return (
        <AudioContextContext.Provider value={audioContext}>
            {children}
        </AudioContextContext.Provider>
    );
};
