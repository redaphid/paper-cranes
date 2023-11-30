import React, { useRef, useEffect, useContext } from 'react';
import { AudioProviderContext } from './AudioProvider'; // Adjust the import path as needed

// Vertex Shader
const vertexShaderSource = `
    attribute vec4 aVertexPosition;
    void main() {
        gl_Position = aVertexPosition;
    }
`;

// Fragment Shader
const fragmentShaderSource = `
    precision mediump float;
    uniform vec4 uColor;
    void main() {
        gl_FragColor = uColor;
    }
`;


export const AudioVisualizer = () => {
  const canvasRef = useRef(null);
  const audioContext = useContext(AudioProviderContext);
  const glRef = useRef(null); // To store the WebGL context

  // Function to update color based on RMS
  const updateColor = (gl, rms) => {
    // Normalize RMS value for color intensity (assuming rms is between 0 and 1)
    const intensity = rms ? Math.min(1, Math.max(0, rms)) : 0;
    const color = [intensity, 0.0, 0.0, 1.0]; // Red color with varying intensity

    gl.clearColor(...color);
    gl.clear(gl.COLOR_BUFFER_BIT);
  };

  useEffect(() => {
    if (!audioContext || !canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl');
    glRef.current = gl;

    if (!gl) {
      console.error('Unable to initialize WebGL. Your browser may not support it.');
      return;
    }

    // Setup WebGL environment
    gl.clearColor(0.0, 0.0, 0.0, 1.0); // Default clear color (black)
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Rendering loop
    const render = () => {
      if (audioContext.audioFeatures?.rms !== undefined) {
        updateColor(gl, audioContext.audioFeatures.rms);
      }

      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);

    // Cleanup
    return () => {
      // WebGL cleanup (if any required)
    };
  }, [audioContext]); // Effect dependency

  return (
    <div>
      <canvas ref={canvasRef} width="640" height="480"></canvas>
    </div>
  );
};

export default AudioVisualizer;
