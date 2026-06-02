export class AmbientSynth {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private oscs: OscillatorNode[] = [];
  private lfos: OscillatorNode[] = [];
  private gainNodes: GainNode[] = [];
  private filter: BiquadFilterNode | null = null;
  private isInitialized = false;

  public start() {
    if (this.isInitialized) {
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume();
      }
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      
      // Warm low-pass filter
      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = "lowpass";
      this.filter.frequency.setValueAtTime(160, this.ctx.currentTime);
      this.filter.Q.setValueAtTime(1.5, this.ctx.currentTime);

      this.masterGain.connect(this.filter);
      this.filter.connect(this.ctx.destination);

      // Create warm drone oscillators
      // Root note (A1 = 55Hz)
      this.createDroneVoice(55.0, 0.4, 0.05); 
      // Detuned root (+5 cents) for lush chorus
      this.createDroneVoice(55.15, 0.35, 0.03); 
      // Perfect fifth (E2 = 82.4Hz) for harmonic depth
      this.createDroneVoice(82.4, 0.2, 0.04); 
      // Major third (C#2 = 69.3Hz) for subtle warmth
      this.createDroneVoice(69.3, 0.15, 0.02);

      // Fade in master volume slowly
      this.masterGain.gain.linearRampToValueAtTime(0.3, this.ctx.currentTime + 3.0);

      this.isInitialized = true;
    } catch (e) {
      console.error("Failed to initialize AmbientSynth:", e);
    }
  }

  private createDroneVoice(frequency: number, maxVolume: number, lfoSpeed: number) {
    if (!this.ctx || !this.masterGain) return;

    // Sub oscillator
    const osc = this.ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);

    // Filter out harsh high frequencies directly from the saw wave
    const localFilter = this.ctx.createBiquadFilter();
    localFilter.type = "lowpass";
    localFilter.frequency.setValueAtTime(200, this.ctx.currentTime);

    // Voice gain
    const voiceGain = this.ctx.createGain();
    voiceGain.gain.setValueAtTime(0, this.ctx.currentTime);

    // Slow LFO for volume breathing
    const lfo = this.ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.setValueAtTime(lfoSpeed, this.ctx.currentTime);

    const lfoGain = this.ctx.createGain();
    // Modulate between (maxVolume * 0.4) and maxVolume
    lfoGain.gain.setValueAtTime(maxVolume * 0.3, this.ctx.currentTime);

    // Connect LFO modulation
    lfo.connect(lfoGain);
    lfoGain.connect(voiceGain.gain);

    // Connect audio path
    osc.connect(localFilter);
    localFilter.connect(voiceGain);
    voiceGain.connect(this.masterGain);

    osc.start();
    lfo.start();

    // Constant offset to make sure it's always audible
    voiceGain.gain.setValueAtTime(maxVolume * 0.5, this.ctx.currentTime);

    this.oscs.push(osc);
    this.lfos.push(lfo);
    this.gainNodes.push(voiceGain);
  }

  public stop() {
    if (!this.ctx || !this.masterGain) return;

    // Smooth fade out before suspending to avoid pops
    this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
    this.masterGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1.0);

    setTimeout(() => {
      if (this.ctx && this.ctx.state === "running") {
        this.ctx.suspend();
      }
    }, 1000);
  }

  public resume() {
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
      if (this.masterGain) {
        this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
        this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
        this.masterGain.gain.linearRampToValueAtTime(0.3, this.ctx.currentTime + 2.0);
      }
    }
  }
}
