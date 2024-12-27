import { Worker } from 'worker_threads';
import { fileURLToPath } from 'url';
import path from 'path';

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class MusicPlayer {
    constructor() {
        this.worker = null;
    }

    /**
     * Initializes the worker if not already created.
     */
    _initializeWorker() {
        if (!this.worker) {
            const workerPath = path.resolve(__dirname, 'musicWorker.js');
            this.worker = new Worker(workerPath);

            this.worker.on('message', (msg) => {
                console.log(`Worker message: ${msg}`);
            });

            this.worker.on('error', (err) => {
                console.error(`Worker error: ${err}`);
            });

            this.worker.on('exit', (code) => {
                console.log(`Worker exited with code ${code}`);
                this.worker = null;
            });
        }
    }

    /**
     * Start playing a music file.
     * @param {string} filePath - Path to the music file.
     */
    play(filePath, playOnce) {
        if (!filePath) {
            throw new Error("A valid file path must be provided.");
        }

        this._initializeWorker();
        this.worker.postMessage({ command: 'play', filePath, playOnce });
    }

    /**
     * Stop the currently playing music.
     */
    stop() {
        if (this.worker) {
            this.worker.postMessage({ command: 'stop' });
        } else {
            console.log("No worker is active to stop music.");
        }
    }

    /**
     * Terminate the worker.
     */
    close() {
        if (this.worker) {
            this.worker.terminate();
            console.log("Worker terminated.");
            this.worker = null;
        } else {
            console.log("No worker is active to terminate.");
        }
    }
}

export default new MusicPlayer();
