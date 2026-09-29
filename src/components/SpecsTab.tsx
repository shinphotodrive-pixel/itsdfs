import React, { useState, useEffect, useRef } from 'react';
import { Sliders, Calculator, Check, AlertCircle } from 'lucide-react';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip } from 'chart.js';
import { CAMERA_SPECS } from '../data/cameraSpecs';

// Register Chart.js components
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip);

export const SpecsTab: React.FC = () => {
  const [testSpeed, setTestSpeed] = useState<number>(100);
  const chartCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  // Calculate displacements
  const speedMS = testSpeed / 3.6;
  const d1msCm = (speedMS * 0.001 * 100).toFixed(2);
  const d50msM = (speedMS * 0.050).toFixed(2);
  const d200msM = (speedMS * 0.200).toFixed(2);

  // Initialize and update Chart.js
  useEffect(() => {
    const canvas = chartCanvasRef.current;
    if (!canvas) return;

    if (!chartInstanceRef.current) {
      chartInstanceRef.current = new Chart(canvas, {
        type: 'bar',
        data: {
          labels: ['머신비전 (1ms)', '교통전용 IP (50ms)', '일반감시 IP (200ms)'],
          datasets: [
            {
              label: '차량 오차 이동거리 (m)',
              data: [
                Number((speedMS * 0.001).toFixed(3)),
                Number((speedMS * 0.05).toFixed(2)),
                Number((speedMS * 0.2).toFixed(2))
              ],
              backgroundColor: [
                'rgba(16, 185, 129, 0.75)',
                'rgba(245, 158, 11, 0.75)',
                'rgba(239, 68, 68, 0.75)'
              ],
              borderColor: ['#10b981', '#f59e0b', '#ef4444'],
              borderWidth: 1.5,
              borderRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            tooltip: {
              callbacks: {
                label: (ctx) => `차량 오차 이동거리: ${ctx.parsed.y} m`
              }
            }
          },
          scales: {
            x: {
              ticks: { color: '#94a3b8', font: { size: 11 } },
              grid: { color: 'rgba(51, 65, 85, 0.3)' }
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: '이동거리 (m)',
                color: '#94a3b8',
                font: { size: 11 }
              },
              ticks: { color: '#94a3b8', font: { size: 11 } },
              grid: { color: 'rgba(51, 65, 85, 0.3)' }
            }
          }
        }
      });
    } else {
      const chart = chartInstanceRef.current;
      chart.data.datasets[0].data = [
        Number((speedMS * 0.001).toFixed(3)),
        Number((speedMS * 0.05).toFixed(2)),
        Number((speedMS * 0.2).toFixed(2))
      ];
      chart.update();
    }

    return () => {
      // Don't necessarily destroy on every render, cleanup on unmount
    };
  }, [speedMS]);

  useEffect(() => {
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="space-y-4">
      {/* Intro Header */}
      <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 shadow-sm">
        <h2 className="text-sm font-bold text-amber-400 flex items-center space-x-2 mb-1">
          <Sliders className="w-4.5 h-4.5" />
          <span>셔터링 지원 카메라 종합 스펙 및 물리 지연 분석</span>
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          외부 속도 센서(레이더, 루프 센서)의 접점 트리거(Alarm IN/GPIO) 신호 인입 시 실시간 셔터링(스냅샷/영상 기록)이
          가능한 주요 카메라 모델별 트리거 지연시간, 셔터 메커니즘, 구축 비용 비교입니다.
        </p>
      </div>

      {/* Interactive Physics Displacement Calculator */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h3 className="text-xs font-bold text-amber-400 flex items-center space-x-1.5">
            <Calculator className="w-4 h-4" />
            <span>속도 & 지연시간(Trigger Latency)에 따른 차량 이동거리 계산기</span>
          </h3>
          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
            공식: Distance(m) = Speed(km/h) ÷ 3.6 × Latency(s)
          </span>
        </div>

        {/* Slider and Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="space-y-1.5">
            <label htmlFor="physics-speed-slider" className="text-xs text-slate-300 font-semibold flex justify-between">
              <span>테스트 차량 속도:</span>
              <span id="physicsSpeedVal" className="text-amber-400 font-mono font-bold text-sm">
                {testSpeed} km/h
              </span>
            </label>
            <input
              id="physics-speed-slider"
              type="range"
              min={20}
              max={200}
              step={5}
              value={testSpeed}
              onChange={(e) => setTestSpeed(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>20 km/h</span>
              <span>100 km/h</span>
              <span>200 km/h</span>
            </div>
          </div>

          <div className="md:col-span-2 grid grid-cols-3 gap-2.5 text-xs font-mono">
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center shadow-inner">
              <span className="text-emerald-400 font-bold block text-[11px]">머신비전 (1ms)</span>
              <p className="text-slate-100 mt-1 font-bold text-base">{d1msCm} cm</p>
              <span className="text-[10px] text-emerald-400/80 flex items-center justify-center gap-0.5 mt-0.5 font-sans">
                <Check className="w-3 h-3 inline" /> 타깃 정중앙 포착
              </span>
            </div>

            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center shadow-inner">
              <span className="text-amber-400 font-bold block text-[11px]">교통전용 (50ms)</span>
              <p className="text-slate-100 mt-1 font-bold text-base">{d50msM} m</p>
              <span className="text-[10px] text-amber-400/80 flex items-center justify-center gap-0.5 mt-0.5 font-sans">
                <AlertCircle className="w-3 h-3 inline" /> 약간의 밀림 발생
              </span>
            </div>

            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center shadow-inner">
              <span className="text-red-400 font-bold block text-[11px]">일반감시 (200ms)</span>
              <p className="text-slate-100 mt-1 font-bold text-base">{d200msM} m</p>
              <span className="text-[10px] text-red-400/80 flex items-center justify-center gap-0.5 mt-0.5 font-sans">
                <AlertCircle className="w-3 h-3 inline" /> 화면 밖 이탈 위험
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Chart Container */}
        <div className="pt-2">
          <p className="text-[11px] text-slate-400 mb-2 font-medium">속도별 지연시간에 따른 차선 내 위치 이탈 오차(m) 시각화</p>
          <div className="w-full max-w-2xl mx-auto h-[280px] md:h-[310px] relative">
            <canvas ref={chartCanvasRef}></canvas>
          </div>
        </div>
      </div>

      {/* Comprehensive Spec Comparison Table */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-lg">
        <div className="p-3.5 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
          <span className="text-xs font-bold text-slate-200">주요 셔터링 지원 카메라 비교표</span>
          <span className="text-[11px] text-emerald-400 font-medium bg-emerald-950/70 border border-emerald-800/80 px-2 py-0.5 rounded">
            Global Shutter 방식 권장
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-semibold">
                <th className="p-3 min-w-[150px]">카메라 모델</th>
                <th className="p-3 min-w-[140px]">타입 / 센서</th>
                <th className="p-3 min-w-[120px]">트리거 지연시간</th>
                <th className="p-3 min-w-[160px]">저장 메커니즘</th>
                <th className="p-3 min-w-[130px]">추정 단가</th>
                <th className="p-3 min-w-[220px]">핵심 특징 및 평가</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {CAMERA_SPECS.map((cam) => (
                <tr key={cam.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3 font-bold text-amber-400">
                    <span className="block">{cam.name}</span>
                    <span className="text-[10px] text-slate-500 font-normal">{cam.brand}</span>
                  </td>
                  <td className="p-3">
                    <span className="block">{cam.type}</span>
                    {cam.isGlobalShutter ? (
                      <span className="text-emerald-400 font-medium text-[11px]">Global Shutter</span>
                    ) : (
                      <span className="text-amber-400 font-medium text-[11px]">Rolling Shutter</span>
                    )}
                  </td>
                  <td className="p-3 font-mono font-semibold">
                    <span className={cam.triggerLatency.includes('<') ? 'text-emerald-400' : 'text-amber-300'}>
                      {cam.triggerLatency}
                    </span>
                  </td>
                  <td className="p-3 text-slate-300 leading-snug">{cam.storage}</td>
                  <td className="p-3 font-semibold text-slate-200">{cam.estPrice}</td>
                  <td className="p-3">
                    <ul className="list-disc list-inside text-[11px] space-y-0.5 text-slate-300">
                      {cam.features.map((f, idx) => (
                        <li key={idx}>{f}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
