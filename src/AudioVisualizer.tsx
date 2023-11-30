import React, { useRef, useEffect, useContext } from 'react';
import { AudioProviderContext } from './AudioProvider';

const vertexShaderSource = `
    attribute vec4 aVertexPosition;
    void main() {
        gl_Position = aVertexPosition;
    }
`;

export const AudioVisualizer = ({ fragmentShaderSource }) => {
  const canvasRef = useRef(null);
  const shaderProgramRef = useRef(null);
  const audioContext = useContext(AudioProviderContext);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl');
    if (!gl) {
      console.error('Unable to initialize WebGL. Your browser may not support it.');
      return;
    }

    // Function to create a shader
    const loadShader = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    // Initialize shaders
    const vertexShader = loadShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = loadShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

    // Create the shader program
    const shaderProgram = gl.createProgram();
    shaderProgramRef.current = shaderProgram;
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
      return;
    }

    gl.useProgram(shaderProgram);

    // Set up the rectangle coordinates (two triangles)
    const vertices = [-1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, -1.0];
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    const positionAttribLocation = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
    gl.vertexAttribPointer(positionAttribLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionAttribLocation);

    const colorUniformLocation = gl.getUniformLocation(shaderProgram, 'uColor');

    const render = () => {
      if (!shaderProgramRef.current) return;

      gl.clear(gl.COLOR_BUFFER_BIT);

      const rms = audioContext.audioFeatures?.rms || 0;
      const color = [rms, 0.0, 0.0, 1.0]; // Red color with varying intensity
      gl.uniform4fv(colorUniformLocation, color);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);

    return () => {
      if (shaderProgramRef.current) {
        gl.deleteProgram(shaderProgramRef.current);
      }
      gl.deleteShader(fragmentShader);
      gl.deleteShader(vertexShader);
      gl.deleteBuffer(vertexBuffer);
    };
  }, [audioContext, fragmentShaderSource]);

  return <canvas ref={canvasRef} width="640" height="480"></canvas>;
};

export default AudioVisualizer;
