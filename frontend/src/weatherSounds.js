let audioCtx = null;
let masterGain = null;
let rainNodes = null;
let windNodes = null;
let thunderTimeout = null;

function getContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.5;
    masterGain.connect(audioCtx.destination);
  }
  return audioCtx;
}

function createNoiseBuffer(ctx, duration = 2) {
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

// intensity: 0 (barely there) to 1 (torrential)
export function startRain(intensity = 0.4) {
  const ctx = getContext();
  if (ctx.state === "suspended") ctx.resume();
  stopRain();

  const clamped = Math.max(0.05, Math.min(1, intensity));

  const noise = ctx.createBufferSource();
  noise.buffer = createNoiseBuffer(ctx, 4);
  noise.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  // light rain = higher, thinner pitch; heavy rain = lower, fuller
  filter.frequency.value = 3200 - clamped * 1400;
  filter.Q.value = 0.5;

  const gain = ctx.createGain();
  gain.gain.value = 0;
  const targetGain = 0.06 + clamped * 0.32; // scales from a whisper to a roar
  gain.gain.linearRampToValueAtTime(targetGain, ctx.currentTime + 1.5);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);
  noise.start();

  rainNodes = { noise, gain };
}

export function stopRain() {
  if (rainNodes && audioCtx) {
    const { noise, gain } = rainNodes;
    try {
      gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1);
      noise.stop(audioCtx.currentTime + 1.1);
    } catch (e) {}
    rainNodes = null;
  }
}

function playThunderCrack() {
  const ctx = getContext();
  const now = ctx.currentTime;

  const rumble = ctx.createOscillator();
  rumble.type = "sine";
  rumble.frequency.setValueAtTime(60, now);
  rumble.frequency.exponentialRampToValueAtTime(30, now + 1.5);

  const rumbleGain = ctx.createGain();
  rumbleGain.gain.setValueAtTime(0, now);
  rumbleGain.gain.linearRampToValueAtTime(0.35, now + 0.05);
  rumbleGain.gain.exponentialRampToValueAtTime(0.001, now + 2);

  rumble.connect(rumbleGain);
  rumbleGain.connect(masterGain);
  rumble.start(now);
  rumble.stop(now + 2);

  const noise = ctx.createBufferSource();
  noise.buffer = createNoiseBuffer(ctx, 0.5);
  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = "highpass";
  noiseFilter.frequency.value = 800;

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.25, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(masterGain);
  noise.start(now);
  noise.stop(now + 0.5);
}

function scheduleNextThunder() {
  const delay = 4000 + Math.random() * 10000;
  thunderTimeout = setTimeout(() => {
    playThunderCrack();
    scheduleNextThunder();
  }, delay);
}

export function startThunderstorm(intensity = 0.85) {
  startRain(intensity);
  scheduleNextThunder();
}

export function stopThunderstorm() {
  stopRain();
  if (thunderTimeout) {
    clearTimeout(thunderTimeout);
    thunderTimeout = null;
  }
}

export function startWind(intensity = 0.4) {
  const ctx = getContext();
  if (ctx.state === "suspended") ctx.resume();
  stopWind();

  const clamped = Math.max(0.1, Math.min(1, intensity));

  const noise = ctx.createBufferSource();
  noise.buffer = createNoiseBuffer(ctx, 6);
  noise.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 300 + clamped * 300;

  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.15;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 150;
  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);
  lfo.start();

  const gain = ctx.createGain();
  gain.gain.value = 0;
  gain.gain.linearRampToValueAtTime(0.03 + clamped * 0.08, ctx.currentTime + 2);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);
  noise.start();

  windNodes = { noise, gain, lfo };
}

export function stopWind() {
  if (windNodes && audioCtx) {
    const { noise, gain, lfo } = windNodes;
    try {
      gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1);
      noise.stop(audioCtx.currentTime + 1.1);
      lfo.stop(audioCtx.currentTime + 1.1);
    } catch (e) {}
    windNodes = null;
  }
}

export function stopAllSounds() {
  stopRain();
  stopWind();
  stopThunderstorm();
}
