const flame = document.querySelector(".flame");
const cake = document.querySelector(".cake");

async function initMic() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;

    source.connect(analyser);
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    function createPopper(xOffset) {
      const popper = document.createElement("div");
      popper.classList.add("popper");

      // random direction and distance
      const x = (Math.random() - 0.5) * 200; // left/right
      const y = -Math.random() * 150 - 50;   // upward
      popper.style.setProperty('--x', `${x}px`);
      popper.style.setProperty('--y', `${y}px`);

      popper.style.left = `${cake.offsetLeft + xOffset}px`;
      popper.style.backgroundColor = `hsl(${Math.random() * 360}, 80%, 50%)`;

      document.body.appendChild(popper);
      setTimeout(() => popper.remove(), 1200);
    }

    function detectBlow() {
      analyser.getByteFrequencyData(dataArray);
      let volume = dataArray.reduce((a, b) => a + b) / dataArray.length;

      if (volume > 35 && !flame.classList.contains("blown")) {
        flame.classList.remove("blown");
        void flame.offsetWidth;
        flame.classList.add("blown");

        setTimeout(() => {
          const msg = document.createElement("h2");
          msg.textContent = "🎉 Happy Birthday! 🎂🎁";
          msg.classList.add("birthday-message");
          document.body.appendChild(msg);

          // Grand confetti poppers
          for (let i = 0; i < 40; i++) {       // more particles
            createPopper(-30); // left side
            createPopper(200); // right side
          }
        }, 1200);
      }

      requestAnimationFrame(detectBlow);
    }

    detectBlow();
  } catch (err) {
    console.error("Mic error:", err);
  }
}

initMic();
