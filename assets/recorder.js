let recordBtn = document.getElementById('recordBtn');
let statusText = document.getElementById('recordingStatus');
let playback = document.getElementById('playback');

let recorder, audioStream;

recordBtn.addEventListener('click', async () => {
  if (recorder && recorder.state === 'recording') {
    recorder.stop();
    audioStream.getTracks().forEach(track => track.stop());
    recordBtn.textContent = 'Start Recording';
    statusText.textContent = 'Recording stopped.';
  } else {
    try {
      audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recorder = new MediaRecorder(audioStream);
      let chunks = [];

      recorder.ondataavailable = e => chunks.push(e.data);
      recorder.onstop = e => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        playback.src = URL.createObjectURL(blob);
        playback.style.display = 'block';
        chunks = [];
      };

      recorder.start();
      recordBtn.textContent = 'Stop Recording';
      statusText.textContent = 'Recording...';
    } catch (err) {
      alert('Microphone access denied or error occurred.');
      console.error(err);
    }
  }
});
