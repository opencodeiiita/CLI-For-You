import { parentPort } from 'worker_threads';
import audioPlay from 'audio-play';
import audioLoader from 'audio-loader';

let currentAudio = null;

parentPort.on('message', async (message) => {
    const { command, filePath, playOnce } = message;

    try {
        if (command === 'play') {
            // Stop current audio if playing
            if (currentAudio) {
                currentAudio.pause();
            }

            // Load the new audio file
            const audioBuffer = await audioLoader(filePath);

            // Set loop option based on playOnce flag
            const options = playOnce ? { loop: false } : { loop: true };

            // Play the audio with the specified options
            currentAudio = audioPlay(audioBuffer, options);

            //parentPort.postMessage(`playing: ${filePath}`);

        } else if (command === 'stop') {
            // Stop the audio if it's currently playing
            if (currentAudio) {
                currentAudio.pause();
                currentAudio = null;
                //parentPort.postMessage('stopped');
            } else {
                //parentPort.postMessage('no audio to stop');
            }
        }
    } catch (error) {
        parentPort.postMessage(`error: ${error.message}`);
    }
});

// Graceful cleanup on process termination
process.on('SIGTERM', () => {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }
    parentPort.postMessage('worker terminated');
});
