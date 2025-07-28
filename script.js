const startBtn = document.getElementById('startBtn');
const car = document.querySelector('.car');
const cakeContainer = document.getElementById('cake-container');
const flame = document.getElementById('flame');

startBtn.addEventListener('click', () => {
  // Play sound
  const audio = new Audio('sound.mp3');
  audio.play().catch(err => console.log('Play error:', err));

  // Add idle animation
  car.classList.add('idle');

  audio.onended = () => {
    startBtn.style.display = 'none';
    car.style.display = 'none';
    cakeContainer.style.display = 'block';

  // Start mic access
    startListening();
  };
});

async function startListening() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new AudioContext();
    const mic = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    mic.connect(analyser);

    function detectBlow() {
      analyser.getByteFrequencyData(dataArray);
      let volume = dataArray.reduce((a, b) => a + b) / dataArray.length;

      if (volume > 50) {
        flame.style.display = 'none';
        console.log("Blown out!");
      }

      requestAnimationFrame(detectBlow);
    }

    detectBlow();
  } catch (error) {
    alert("Microphone access is needed to blow the candle.");
    console.error(error);
  }
}