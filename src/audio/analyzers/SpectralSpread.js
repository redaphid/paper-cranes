// Web Worker script for processing FFT data.

let historySize = 500 // Define history size
let queue = []
let sum = 0
let sumOfSquares = 0
let minQueue = []
let maxQueue = []

function updateMinMaxQueues(value) {
    while (minQueue.length && minQueue[minQueue.length - 1] > value) {
        minQueue.pop()
    }
    while (maxQueue.length && maxQueue[maxQueue.length - 1] < value) {
        maxQueue.pop()
    }
    minQueue.push(value)
    maxQueue.push(value)
}

function removeOldFromMinMaxQueues(oldValue) {
    if (minQueue[0] === oldValue) {
        minQueue.shift()
    }
    if (maxQueue[0] === oldValue) {
        maxQueue.shift()
    }
}

function calculateStats(value) {
    if (typeof value !== 'number') throw new Error('Input must be a number')

    updateMinMaxQueues(value)

    queue.push(value)
    sum += value
    sumOfSquares += value * value

    if (queue.length > historySize) {
        let removed = queue.shift()
        sum -= removed
        sumOfSquares -= removed * removed
        removeOldFromMinMaxQueues(removed)
    }

    let mean = sum / queue.length
    let variance = sumOfSquares / queue.length - mean * mean
    let min = minQueue.length ? minQueue[0] : Infinity
    let max = maxQueue.length ? maxQueue[0] : -Infinity

    return {
        normalized: queue.length && max !== min ? (value - min) / (max - min) : 0,
        mean,
        standardDeviation: Math.sqrt(variance),
        zScore: (variance ? (value - mean) / Math.sqrt(variance) : 0) / 3,
        min,
        max,
    }
}

let lastFFtSize = 0
let maxSpread = 0

self.addEventListener('message', ({ data: e }) => {
    if (e.type === 'fftData') {
        let fftData = e.data.fft // Extract FFT data from message

        if (lastFFtSize !== fftData.length) {
            maxSpread = calculateMaxSpread(fftData.length)
            lastFFtSize = fftData.length
        }

        let computed = calculateSpectralSpread(fftData) // Process FFT data
        self.postMessage({ type: 'computedValue', value: computed, stats: calculateStats(computed) })
    }
    if (e.type === 'config') {
        historySize = e.config.historySize
    }
})

function mu(i, amplitudeSpect) {
    let numerator = 0
    let denominator = 0

    for (let k = 0; k < amplitudeSpect.length; k++) {
        numerator += Math.pow(k, i) * Math.abs(amplitudeSpect[k])
        denominator += amplitudeSpect[k]
    }

    if (denominator === 0) return 0 // Prevent division by zero
    return numerator / denominator
}
function calculateMaxSpread(fftSize) {
    // Create a spectrum with energy at the two extremes
    const extremeSpectrum = new Array(fftSize).fill(0)
    extremeSpectrum[0] = 1 // Energy at the lowest frequency
    extremeSpectrum[fftSize - 1] = 1 // Energy at the highest frequency

    const meanFrequency = mu(1, extremeSpectrum)
    const secondMoment = mu(2, extremeSpectrum)

    return Math.sqrt(secondMoment - Math.pow(meanFrequency, 2))
}
function calculateSpectralSpread(fftData) {
    const meanFrequency = mu(1, fftData)
    const secondMoment = mu(2, fftData)

    const spread = Math.sqrt(secondMoment - Math.pow(meanFrequency, 2))
    // Normalize the spread
    return maxSpread ? spread / maxSpread : 0
}
