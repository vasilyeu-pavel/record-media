const video = document.getElementById('video');
const start = document.getElementById('start');
const stop = document.getElementById('stop');

const download = document.getElementById('download');

const VIDEO_SRC = './movie-movie.mp4';
const NAME = 'fileName.webm';
const data = [];

if (VIDEO_SRC) {
  video.src= VIDEO_SRC;
}

let recorder;
let recordedBlob = null;

const downloadHandler = () => {
  console.log('download');
  const a = document.createElement('a');
  document.body.appendChild(a);
  a.style.display = 'none';

  const url = URL.createObjectURL(recordedBlob);
  a.href = url;
  a.download = NAME;

  a.click();
  window.URL.revokeObjectURL(url);
};

const stopRecordHandler = () => {
  console.log('stop');

  const stopped = new Promise((resolve, reject) => {
    recorder.onstop = resolve;
    recorder.onerror = event => reject(event.name);
  });

  let recorded = Promise.resolve().then(
    () => recorder.state == "recording" && recorder.stop()
  );

  return Promise.all([
    stopped,
    recorded
  ])
    .then(() => data)
    .then (recordedChunks => {
      recordedBlob = new Blob(recordedChunks, { type: "video/webm" });
    })
};

const startRecordHandler = () => {
  console.log('start');
  const stream = video.captureStream();
  recorder = new MediaRecorder(stream);

  recorder.ondataavailable = event => data.push(event.data);
  recorder.start();
};

download.addEventListener('click', downloadHandler);
stop.addEventListener('click', stopRecordHandler);
start.addEventListener('click', startRecordHandler);
