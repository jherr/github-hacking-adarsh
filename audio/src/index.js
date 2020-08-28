const OFF = "#ebedf0";
const ON = "#216e39";

const columns = [
  ...document.querySelectorAll(".js-calendar-graph > svg > g > g"),
].map((col) => [...col.querySelectorAll("rect")]);

const SAMPLE_SIZE = 1024;

window.AudioContext = (function () {
  return (
    window.webkitAudioContext || window.AudioContext || window.mozAudioContext
  );
})();

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

document.querySelector("body").addEventListener("click", function () {
  audioCtx.resume().then(() => {
    console.log("Microphone access resumed");
  });
});

const gotStream = (stream) => {
  const analyser = audioCtx.createAnalyser();
  const javascriptNode = audioCtx.createScriptProcessor(SAMPLE_SIZE, 1, 1);

  const mediaStreamSource = audioCtx.createMediaStreamSource(stream);
  mediaStreamSource.connect(audioCtx.destination);
  mediaStreamSource.connect(analyser);
  javascriptNode.connect(audioCtx.destination);

  analyser.fftSize = SAMPLE_SIZE;
  const bufferLength = analyser.fftSize;
  const dataArray = new Uint8Array(bufferLength);
  analyser.getByteFrequencyData(dataArray);

  javascriptNode.onaudioprocess = () => {
    analyser.getByteFrequencyData(dataArray);

    columns.forEach((cols, cx) => {
      const value = Math.floor(
        dataArray.slice(cx * 4, cx * 4 + 4).reduce((a, b) => a + b, 0) / 4
      );
      const scaledValue = ((value - 127) / 64) * 7;
      cols.forEach((_, cy) => {
        if (columns[cx] && columns[cx][6 - cy]) {
          columns[cx][6 - cy].style.fill = cy < scaledValue ? ON : OFF;
        }
      });
    });
  };
};

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
navigator.getUserMedia({ audio: true }, gotStream, () => {});
