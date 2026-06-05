export function WaveDivider() {
  return (
    <div className="pointer-events-none relative -mt-1 h-24 w-full overflow-hidden print:hidden">
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="absolute bottom-0 h-full w-full"
        aria-hidden
      >
        <defs>
          <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#0ea5e9" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.35" />
          </linearGradient>
        </defs>
        <path
          fill="url(#waveGrad)"
          d="M0,64 C240,120 480,0 720,48 C960,96 1200,24 1440,64 L1440,120 L0,120 Z"
        />
        <path
          fill="rgba(255,255,255,0.6)"
          d="M0,80 C360,40 480,100 720,72 C960,44 1080,88 1440,56 L1440,120 L0,120 Z"
        />
      </svg>
    </div>
  );
}
