import React from 'react';
import { Gauge, List, Camera, Cpu } from 'lucide-react';
import { TabType } from '../types';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'tab-monitor' as TabType, label: '실시간 관제 & 시뮬레이터', icon: Gauge, mobLabel: '모니터' },
    { id: 'tab-logs' as TabType, label: '차량 단속/통과 로그', icon: List, mobLabel: '로그' },
    { id: 'tab-specs' as TabType, label: '카메라 스펙 & 물리 분석', icon: Camera, mobLabel: '카메라' },
    { id: 'tab-wiring' as TabType, label: '하드웨어 결선 가이드', icon: Cpu, mobLabel: '결선' },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav id="desktop-nav" className="bg-slate-900 border-b border-slate-800 px-4 py-2 hidden md:block">
        <div className="max-w-6xl mx-auto flex items-center space-x-1.5 text-xs font-medium">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`desk-tab-${tab.id}`}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition cursor-pointer ${
                  isActive
                    ? 'text-amber-400 bg-slate-800 border border-amber-500/40 shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav id="mobile-bottom-nav" className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur border-t border-slate-800 py-2 px-3 z-40 md:hidden">
        <div className="max-w-md mx-auto flex items-center justify-around text-xs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`mob-tab-${tab.id}`}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center space-y-1 transition py-1 px-2 cursor-pointer ${
                  isActive ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[11px]">{tab.mobLabel}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
