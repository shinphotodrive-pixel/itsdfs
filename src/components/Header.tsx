import React from 'react';
import { Gauge, Volume2, VolumeX, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  isSoundEnabled: boolean;
  onToggleSound: () => void;
  isViolationAlert?: boolean;
  lastViolationSpeed?: number | null;
}

export const Header: React.FC<HeaderProps> = ({
  isSoundEnabled,
  onToggleSound,
  isViolationAlert = false,
  lastViolationSpeed = null
}) => {
  return (
    <header id="app-header" className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-4 py-3 flex items-center justify-between shadow-xl">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/30 shadow-inner">
          <Gauge className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-base font-bold text-white flex items-center gap-2">
            스피드 모니터링 <span className="text-xs font-normal text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/80">DFS & Shutter System</span>
          </h1>
          <p className="text-xs text-slate-400">속도 검출 및 고속 카메라 트리거 셔터링 연동 관제 시스템</p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {/* Dynamic Visual Violation Alert Indicator */}
        {isViolationAlert ? (
          <div
            id="overspeed-header-alert"
            className="flex items-center space-x-2 bg-red-950 text-red-200 text-xs px-3.5 py-1.5 rounded-full border-2 border-red-500 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.85)]"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-ping"></span>
            <span className="font-black text-red-300 tracking-tight flex items-center gap-1">
              과속 단속 경보! {lastViolationSpeed ? `[${lastViolationSpeed} km/h]` : ''}
            </span>
          </div>
        ) : (
          /* Normal Hardware Status Badge */
          <div id="hw-status-badge" className="flex items-center space-x-1.5 bg-emerald-950/80 text-emerald-400 text-xs px-3 py-1.5 rounded-full border border-emerald-800/80 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <ShieldCheck className="w-3.5 h-3.5 inline text-emerald-400" />
            <span className="font-semibold">하드웨어 정상</span>
          </div>
        )}

        {/* Audio Switcher Button */}
        <button
          id="sound-toggle-btn"
          type="button"
          onClick={onToggleSound}
          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs flex items-center space-x-1.5 border border-slate-700 transition cursor-pointer"
          title={isSoundEnabled ? '음향 끄기' : '음향 켜기'}
        >
          {isSoundEnabled ? (
            <>
              <Volume2 className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline font-medium">음향 ON</span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline font-medium text-slate-400">음향 OFF</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
