import React from 'react';

interface EnforcementPoleSignProps {
  speed: number;
  roadLimit: number;
  isShutterActive: boolean;
}

export const EnforcementPoleSign: React.FC<EnforcementPoleSignProps> = ({
  speed,
  roadLimit,
  isShutterActive
}) => {
  const isOverspeed = speed > roadLimit;

  // Format speed for 7-segment display (up to 3 digits)
  const displaySpeedStr = speed > 0 ? (speed < 10 ? `0${speed}` : `${speed}`) : '00';

  return (
    <div className="flex flex-col items-center justify-center p-1 sm:p-2">
      {/* Outer Yellow Enforcement Housing (matches uploaded photo) */}
      <div
        id="enforcement-pole-housing"
        className="relative w-full max-w-[270px] sm:max-w-[290px] bg-[#fbc02d] border-[3px] border-black rounded-[36px] p-4 sm:p-5 shadow-2xl flex flex-col items-center justify-between select-none transition-all duration-200"
        style={{
          boxShadow: isShutterActive
            ? '0 0 35px rgba(255, 255, 255, 0.9), 0 10px 25px rgba(0, 0, 0, 0.5)'
            : '0 10px 30px rgba(0, 0, 0, 0.45)'
        }}
      >
        {/* Top: Dual Camera Lenses with Aperture Blades */}
        <div className="w-full flex items-center justify-around px-2 pt-1 pb-3">
          {/* Left Camera Lens */}
          <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-slate-950 border-[5px] border-[#2b2b2b] shadow-[inset_0_4px_10px_rgba(0,0,0,0.9),0_4px_8px_rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden">
            {/* Outer metallic stepped bezel ring */}
            <div className="absolute inset-1 rounded-full border border-slate-600/40 pointer-events-none"></div>

            {/* Aperture Iris Blades (SVG representation) */}
            <svg
              viewBox="0 0 100 100"
              className={`w-full h-full transform transition-transform duration-300 ${
                isShutterActive ? 'scale-110 rotate-45' : 'rotate-0'
              }`}
            >
              <defs>
                <radialGradient id="lensGlass" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#0a0f1d" />
                  <stop offset="65%" stopColor="#111827" />
                  <stop offset="85%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#020617" />
                </radialGradient>
                <linearGradient id="bladeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#334155" />
                  <stop offset="50%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
              </defs>

              {/* Lens Base Glass */}
              <circle cx="50" cy="50" r="46" fill="url(#lensGlass)" />

              {/* 8 Aperture Iris Blades */}
              <g stroke="#0f172a" strokeWidth="0.8">
                <path d="M 50,12 C 65,18 78,35 68,50 L 50,50 Z" fill="url(#bladeGrad)" opacity="0.9" />
                <path d="M 76,23 C 86,40 82,60 62,62 L 50,50 Z" fill="url(#bladeGrad)" opacity="0.9" />
                <path d="M 87,50 C 82,68 65,78 50,68 L 50,50 Z" fill="url(#bladeGrad)" opacity="0.9" />
                <path d="M 76,76 C 60,86 40,82 38,62 L 50,50 Z" fill="url(#bladeGrad)" opacity="0.9" />
                <path d="M 50,88 C 35,82 22,65 32,50 L 50,50 Z" fill="url(#bladeGrad)" opacity="0.9" />
                <path d="M 24,77 C 14,60 18,40 38,38 L 50,50 Z" fill="url(#bladeGrad)" opacity="0.9" />
                <path d="M 13,50 C 18,32 35,22 50,32 L 50,50 Z" fill="url(#bladeGrad)" opacity="0.9" />
                <path d="M 24,24 C 40,14 60,18 62,38 L 50,50 Z" fill="url(#bladeGrad)" opacity="0.9" />
              </g>

              {/* Central Iris Aperture Opening */}
              <circle cx="50" cy="50" r="16" fill="#000000" />
              <circle cx="50" cy="50" r="15" fill="#050811" />
              <circle cx="50" cy="50" r="7" fill="#02040a" />

              {/* Specular Curved Reflection Highlight */}
              <path
                d="M 28,26 A 34 34 0 0 1 72 26"
                stroke="rgba(255, 255, 255, 0.45)"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M 34,32 A 26 26 0 0 1 66 32"
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
              />
            </svg>

            {/* Xenon Strobe Flash Overlay on violation */}
            {isShutterActive && (
              <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-90 pointer-events-none" />
            )}
          </div>

          {/* Right Camera Lens */}
          <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-slate-950 border-[5px] border-[#2b2b2b] shadow-[inset_0_4px_10px_rgba(0,0,0,0.9),0_4px_8px_rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden">
            {/* Outer metallic stepped bezel ring */}
            <div className="absolute inset-1 rounded-full border border-slate-600/40 pointer-events-none"></div>

            {/* Aperture Iris Blades */}
            <svg
              viewBox="0 0 100 100"
              className={`w-full h-full transform transition-transform duration-300 ${
                isShutterActive ? 'scale-110 -rotate-45' : 'rotate-0'
              }`}
            >
              {/* Lens Base Glass */}
              <circle cx="50" cy="50" r="46" fill="url(#lensGlass)" />

              {/* 8 Aperture Iris Blades */}
              <g stroke="#0f172a" strokeWidth="0.8">
                <path d="M 50,12 C 65,18 78,35 68,50 L 50,50 Z" fill="url(#bladeGrad)" opacity="0.9" />
                <path d="M 76,23 C 86,40 82,60 62,62 L 50,50 Z" fill="url(#bladeGrad)" opacity="0.9" />
                <path d="M 87,50 C 82,68 65,78 50,68 L 50,50 Z" fill="url(#bladeGrad)" opacity="0.9" />
                <path d="M 76,76 C 60,86 40,82 38,62 L 50,50 Z" fill="url(#bladeGrad)" opacity="0.9" />
                <path d="M 50,88 C 35,82 22,65 32,50 L 50,50 Z" fill="url(#bladeGrad)" opacity="0.9" />
                <path d="M 24,77 C 14,60 18,40 38,38 L 50,50 Z" fill="url(#bladeGrad)" opacity="0.9" />
                <path d="M 13,50 C 18,32 35,22 50,32 L 50,50 Z" fill="url(#bladeGrad)" opacity="0.9" />
                <path d="M 24,24 C 40,14 60,18 62,38 L 50,50 Z" fill="url(#bladeGrad)" opacity="0.9" />
              </g>

              {/* Central Iris Aperture Opening */}
              <circle cx="50" cy="50" r="16" fill="#000000" />
              <circle cx="50" cy="50" r="15" fill="#050811" />
              <circle cx="50" cy="50" r="7" fill="#02040a" />

              {/* Specular Curved Reflection Highlight */}
              <path
                d="M 28,26 A 34 34 0 0 1 72 26"
                stroke="rgba(255, 255, 255, 0.45)"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M 34,32 A 26 26 0 0 1 66 32"
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
              />
            </svg>

            {/* Xenon Strobe Flash Overlay on violation */}
            {isShutterActive && (
              <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-90 pointer-events-none" />
            )}
          </div>
        </div>

        {/* Middle: Circular Speed Limit Traffic Sign (Red Circle with Limit Number) */}
        <div className="my-2 sm:my-3">
          <div className="w-26 h-26 sm:w-28 sm:h-28 rounded-full border-[8px] border-[#e11d48] bg-white flex items-center justify-center shadow-md">
            <span className="text-4xl sm:text-5xl font-black text-black tracking-tight font-sans">
              {roadLimit}
            </span>
          </div>
        </div>

        {/* Bottom Section: White Card with "과속 / 촬영중" and Digital LED Display */}
        <div className="w-full bg-white border-[3px] border-black rounded-[22px] p-2.5 sm:p-3 flex flex-col items-center shadow-md">
          {/* Korean Enforcement Sign Text */}
          <div className="w-full text-center py-0.5">
            <div className="text-2xl sm:text-[26px] font-black text-black tracking-widest leading-tight">
              과속
            </div>
            <div className="w-20 sm:w-24 h-[3px] bg-black mx-auto my-1 rounded-full"></div>
            <div className="text-2xl sm:text-[26px] font-black text-black tracking-widest leading-tight">
              촬영중
            </div>
          </div>

          {/* 7-Segment Digital Speed Display Box (matches uploaded photo's LED display) */}
          <div className="w-full mt-2 bg-[#1a1b1f] border-[3px] border-[#2d2e34] rounded-lg p-2 relative overflow-hidden shadow-inner flex items-center justify-center min-h-[85px] sm:min-h-[100px]">
            {/* Faint unlit segment silhouette background (188) matching the photo! */}
            <div
              className="absolute inset-0 flex items-center justify-center font-digital text-5xl sm:text-6xl font-black text-[#2e3038] tracking-widest opacity-40 select-none pointer-events-none"
              aria-hidden="true"
            >
              188
            </div>

            {/* Active Lit Digits */}
            <div
              id="dfs-live-speed-digit"
              className={`relative z-10 font-digital text-5xl sm:text-6xl font-black tracking-wider transition-all duration-150 ${
                isOverspeed
                  ? 'text-red-500 drop-shadow-[0_0_14px_rgba(239,68,68,0.95)] animate-pulse'
                  : speed > 0
                  ? 'text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.7)]'
                  : 'text-emerald-500/80'
              }`}
            >
              {displaySpeedStr}
            </div>

            {/* KM/H Unit indicator */}
            <span className="absolute bottom-1 right-2 text-[10px] font-mono text-slate-500 font-bold">
              km/h
            </span>
          </div>

          {/* Status Message Tag */}
          <div className="mt-2 w-full text-center">
            {isOverspeed ? (
              <span className="inline-block bg-red-600 text-white font-bold text-xs px-2.5 py-0.5 rounded shadow animate-bounce">
                과속 위반 단속중!
              </span>
            ) : (
              <span className="inline-block text-[11px] text-slate-700 font-semibold">
                안전 운행 구간
              </span>
            )}
          </div>
        </div>

        {/* Shutter Active Lens Ring Pulse Effect */}
        {isShutterActive && (
          <div className="absolute inset-0 rounded-[36px] border-4 border-white animate-pulse pointer-events-none"></div>
        )}
      </div>
    </div>
  );
};
