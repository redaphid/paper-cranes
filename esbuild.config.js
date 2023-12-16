const fs = require('fs')
const path = require('path')
const esbuild = require('esbuild')
// Function to list all files in a directory recursively in a synchronous fashion
const walkSync = (dir, filelist = []) => {
    fs.readdirSync(dir).forEach((file) => {
        filelist = fs.statSync(path.join(dir, file)).isDirectory()
            ? walkSync(path.join(dir, file), filelist)
            : filelist.concat(path.join(dir, file))
    })
    return filelist
}

// Get all files in './src/audio/analyzers'
const analyzersPath = path.join(__dirname, './src/audio/analyzers')
const analyzerFiles = walkSync(analyzersPath).map((file) => path.relative(__dirname, file))

analyzerFiles.push('./index.js')
console.log(analyzerFiles)
// Esbuild configuration
esbuild
    .build({
        format: 'esm',
        entryPoints: analyzerFiles,
        outdir: 'dist',
        bundle: true,
        minify: true,
        sourcemap: false,
        loader: {
            '.js': 'jsx', // Adjust as needed
        },
    })
    .catch(() => process.exit(1))
