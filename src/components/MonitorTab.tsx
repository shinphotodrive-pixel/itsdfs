import React, { useRef, useEffect, useCallback, useState } from 'react';
import {
  Car,
  AlertTriangle,
  ShieldAlert,
  Camera,
  Video,
  CheckCircle,
  Zap,
  Play,
  Square,
  Aperture,
  Image as ImageIcon
} from 'lucide-react';
import { Vehicle, LogEntry } from '../types';
import { generateSnapshotImage, generateRandomKoreanPlate } from '../utils/snapshotGenerator';
import { playRadarBeep, playShutterClick } from '../utils/audio';
import { EnforcementPoleSign } from './EnforcementPoleSign';

const CAR_COLORS = [
  '#ef4444',
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#8b5cf6',
  '#ec4899',
  '#f3f4f6',
  '#475569'
];

interface MonitorTabProps {
  roadLimit: number;
  onSetRoadLimit: (limit: number) => void;
  selectedCamera: string;
  onSelectCamera: (cam: string) => void;
  isSoundEnabled: boolean;
  totalVehicleCount: number;
  overspeedCount: number;
  recentSnapshots: LogEntry[];
  onAddLog: (entry: LogEntry) => void;
  onIncrementVehicleCount: () => void;
  onIncrementOverspeedCount: () => void;
  onOpenModal: (entry: LogEntry) => void;
  onTriggerFlash: () => void;
}

export const MonitorTab: React.FC<MonitorTabProps> = ({
  roadLimit,
  onSetRoadLimit,
  selectedCamera,
  onSelectCamera,
  isSoundEnabled,
  totalVehicleCount,
  overspeedCount,
  recentSnapshots,
  onAddLog,
  onIncrementVehicleCount,
  onIncrementOverspeedCount,
  onOpenModal,
  onTriggerFlash
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const vehiclesRef = useRef<Vehicle[]>([]);
  const [displayedSpeed, setDisplayedSpeed] = useState<number>(0);
  const [pulseActive, setPulseActive] = useState<boolean>(false);
  const [isAutoLoop, setIsAutoLoop] = useState<boolean>(false);
  const autoLoopTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Synchronize road limit & camera in refs for animation loop
  const roadLimitRef = useRef(roadLimit);
  roadLimitRef.current = roadLimit;
  const selectedCameraRef = useRef(selectedCamera);
  selectedCameraRef.current = selectedCamera;
  const isSoundEnabledRef = useRef(isSoundEnabled);
  isSoundEnabledRef.current = isSoundEnabled;

  const triggerAlarmPulse = useCallback(() => {
    setPulseActive(true);
    setTimeout(() => {
      setPulseActive(false);
    }, 600);
  }, []);

  const executeShutter = useCallback(
    (vehicle: Vehicle) => {
      playShutterClick(isSoundEnabledRef.current);
      onTriggerFlash();
      onIncrementOverspeedCount();

      const snapshotUrl = generateSnapshotImage(
        vehicle.plate,
        vehicle.speed,
        roadLimitRef.current,
        vehicle.color,
        selectedCameraRef.current
      );

      const logItem: LogEntry = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour12: false }),
        plate: vehicle.plate,
        speed: vehicle.speed,
        limit: roadLimitRef.current,
        isOverspeed: true,
        camera: selectedCameraRef.current,
        imageUrl: snapshotUrl
      };

      onAddLog(logItem);
    },
    [onAddLog, onIncrementOverspeedCount, onTriggerFlash]
  );

  // Spawn vehicle helper
  const spawnVehicle = useCallback(
    (type: 'normal' | 'overspeed') => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const currentLimit = roadLimitRef.current;
      let targetSpeed: number;
      if (type === 'overspeed') {
        const offset = Math.floor(Math.random() * 28 + 15);
        targetSpeed = currentLimit + offset;
      } else {
        const offset = Math.floor(Math.random() * 8 - 14);
        targetSpeed = Math.max(15, currentLimit + offset);
      }

      const newVehicle: Vehicle = {
        id: Date.now() + Math.random(),
        x: -85,
        y: canvas.height / 2 - 14,
        width: 60,
        height: 28,
        speed: targetSpeed,
        color: CAR_COLORS[Math.floor(Math.random() * CAR_COLORS.length)],
        plate: generateRandomKoreanPlate(),
        radarTriggered: false,
        cameraTriggered: false
      };

      vehiclesRef.current.push(newVehicle);
      onIncrementVehicleCount();
    },
    [onIncrementVehicleCount]
  );

  const handleManualShutter = useCallback(() => {
    const dummyVehicle: Vehicle = {
      id: Date.now(),
      x: 0,
      y: 0,
      width: 60,
      height: 28,
      plate: generateRandomKoreanPlate(),
      speed: roadLimit + Math.floor(Math.random() * 32 + 12),
      color: '#ef4444',
      radarTriggered: true,
      cameraTriggered: true
    };
    executeShutter(dummyVehicle);
  }, [executeShutter, roadLimit]);

  // Toggle Auto Traffic Loop
  const toggleAutoLoop = useCallback(() => {
    if (isAutoLoop) {
      if (autoLoopTimerRef.current) {
        clearInterval(autoLoopTimerRef.current);
        autoLoopTimerRef.current = null;
      }
      setIsAutoLoop(false);
    } else {
      setIsAutoLoop(true);
      autoLoopTimerRef.current = setInterval(() => {
        const isOver = Math.random() > 0.6;
        spawnVehicle(isOver ? 'overspeed' : 'normal');
      }, 2300);
    }
  }, [isAutoLoop, spawnVehicle]);

  useEffect(() => {
    return () => {
      if (autoLoopTimerRef.current) {
        clearInterval(autoLoopTimerRef.current);
      }
    };
  }, []);

  // Main Canvas Animation Loop with ResizeObserver
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      if (!canvas.parentElement) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
    });
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }
    resize();

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // 1. Asphalt Road Base
      ctx.fillStyle = '#0a0f1d';
      ctx.fillRect(0, 0, width, height);

      // Road shoulder lines
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 16);
      ctx.lineTo(width, 16);
      ctx.moveTo(0, height - 16);
      ctx.lineTo(width, height - 16);
      ctx.stroke();

      // Dotted Center Lane
      ctx.strokeStyle = '#475569';
      ctx.setLineDash([16, 16]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();
      ctx.setLineDash([]);

      const radarX = width * 0.33;
      const cameraX = width * 0.66;

      // Radar cone visual beam on road
      ctx.fillStyle = 'rgba(245, 158, 11, 0.04)';
      ctx.beginPath();
      ctx.moveTo(radarX - 45, 0);
      ctx.lineTo(radarX + 45, height);
      ctx.lineTo(radarX - 10, height);
      ctx.closePath();
      ctx.fill();

      // Update & Render Vehicles
      const vehicles = vehiclesRef.current;
      for (let i = vehicles.length - 1; i >= 0; i--) {
        const v = vehicles[i];
        v.x += v.speed / 11;

        // Position Y aligned to road lane
        v.y = height / 2 - v.height / 2;

        // Radar Trigger at 33%
        if (v.x >= radarX && !v.radarTriggered) {
          v.radarTriggered = true;
          setDisplayedSpeed(v.speed);
          playRadarBeep(isSoundEnabledRef.current);
          triggerAlarmPulse();
        }

        // Camera Trap Line at 66%
        if (v.x >= cameraX && !v.cameraTriggered) {
          v.cameraTriggered = true;
          if (v.speed > roadLimitRef.current) {
            executeShutter(v);
          } else {
            // Normal pass log
            const logItem: LogEntry = {
              id: Date.now() + Math.floor(Math.random() * 1000),
              timestamp: new Date().toLocaleTimeString('ko-KR', { hour12: false }),
              plate: v.plate,
              speed: v.speed,
              limit: roadLimitRef.current,
              isOverspeed: false,
              camera: selectedCameraRef.current,
              imageUrl: undefined
            };
            onAddLog(logItem);
          }
        }

        // Render Car Body
        ctx.fillStyle = v.color;
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(v.x, v.y, v.width, v.height, 6);
        } else {
          ctx.rect(v.x, v.y, v.width, v.height);
        }
        ctx.fill();

        // Car Roof & Windows
        ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
        ctx.fillRect(v.x + 14, v.y + 4, 26, v.height - 8);

        // Headlights (Right side since cars travel left to right)
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(v.x + v.width - 3, v.y + 3, 3, 5);
        ctx.fillRect(v.x + v.width - 3, v.y + v.height - 8, 3, 5);

        // Taillights
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(v.x, v.y + 3, 2, 5);
        ctx.fillRect(v.x, v.y + v.height - 8, 2, 5);

        // Speed Tag Above Car
        ctx.fillStyle = v.speed > roadLimitRef.current ? '#ef4444' : '#10b981';
        ctx.font = 'bold 11px "JetBrains Mono", sans-serif';
        ctx.fillText(`${v.speed} km/h`, v.x + 4, v.y - 7);

        // Remove off-screen vehicles
        if (v.x > width + 120) {
          vehicles.splice(i, 1);
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
    };
  }, [executeShutter, onAddLog, triggerAlarmPulse]);

  // Zone Label calculation
  const getZoneLabel = () => {
    if (roadLimit === 20) return '보행자 우선구역 (20km/h)';
    if (roadLimit === 30) return '어린이 보호구역 (스쿨존 30km/h)';
    if (roadLimit === 50) return '도시부 도로 (안전속도 5030)';
    return '일반 간선 국도 (80km/h)';
  };

  return (
    <div className="space-y-4">
      {/* Intro Banner */}
      <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 text-xs leading-relaxed text-slate-300 shadow-sm">
        <strong className="text-amber-400 font-bold block mb-0.5">실시간 도로 속도 관제 & 셔터링 시뮬레이션</strong>
        도로를 통과하는 차량의 속도를 레이더 센서가 실시간 검출하며, 제한속도 초과 시 카메라 Trap 구역에서 접점 신호(Alarm IN)를 전송하여 순간 스냅샷을 캡처합니다. 아래 버튼으로 테스트 차량을 발생시켜 보세요.
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div id="stat-card-total" className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-slate-400 font-medium">총 감지 차량</p>
            <p id="stat-total" className="text-2xl font-bold font-digital text-white mt-1">
              {totalVehicleCount} 대
            </p>
          </div>
          <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20">
            <Car className="w-6 h-6" />
          </div>
        </div>

        <div id="stat-card-overspeed" className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-slate-400 font-medium">과속 단속 건수</p>
            <p id="stat-overspeed" className="text-2xl font-bold font-digital text-red-400 mt-1">
              {overspeedCount} 건
            </p>
          </div>
          <div className="p-2.5 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div id="stat-card-limit" className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-slate-400 font-medium">현재 도로 제한속도</p>
            <p id="stat-limit" className="text-2xl font-bold font-digital text-amber-400 mt-1">
              {roadLimit} km/h
            </p>
          </div>
          <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>

        <div id="stat-card-camera" className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-slate-400 font-medium">선택 셔터 카메라</p>
            <p id="stat-camera" className="text-sm font-bold text-slate-200 mt-1.5 truncate max-w-[130px]">
              {selectedCamera}
            </p>
          </div>
          <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
            <Camera className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* DFS Sign & Live Track Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Authentic Korean Speed Enforcement Pole Housing (Matches uploaded image) */}
        <div id="dfs-sign-card" className="bg-slate-900 rounded-2xl border border-slate-800 p-3 sm:p-4 flex flex-col items-center justify-between shadow-lg">
          {/* Top Zone Label Badge */}
          <div className="w-full bg-slate-950/80 border border-slate-800 text-amber-400 font-bold text-center py-1.5 px-3 rounded-xl text-xs tracking-wider mb-2 flex items-center justify-between">
            <span className="font-sans text-slate-300">구역 구분:</span>
            <span className="text-amber-400 font-extrabold">{getZoneLabel()}</span>
          </div>

          <EnforcementPoleSign
            speed={displayedSpeed}
            roadLimit={roadLimit}
            isShutterActive={pulseActive}
          />

          {/* Alarm Signal Indicator */}
          <div className="w-full mt-3 flex items-center justify-between text-xs text-slate-400 bg-slate-950/90 px-3 py-2 rounded-lg border border-slate-800">
            <span className="flex items-center space-x-2">
              <span
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  pulseActive ? 'bg-amber-400 animate-ping' : 'bg-slate-600'
                }`}
              ></span>
              <span className="font-medium">Alarm IN 펄스:</span>
            </span>
            <span className={`font-mono ${pulseActive ? 'text-amber-400 font-bold' : 'text-slate-400'}`}>
              {pulseActive ? '접점 트리거 인가 (HIGH)' : '대기중 (OFF)'}
            </span>
          </div>
        </div>

        {/* Road Track Simulator Container */}
        <div id="road-simulator-card" className="lg:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 p-3.5 flex flex-col justify-between relative shadow-lg">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-bold text-slate-200 flex items-center space-x-1.5">
              <Video className="w-4 h-4 text-emerald-400" />
              <span>실시간 도로 감지 시뮬레이터</span>
            </span>
            <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
              레이더 주사각: 15° / 유효 감지거리: 50m
            </span>
          </div>

          {/* Canvas Viewport */}
          <div className="relative w-full h-60 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-inner">
            <canvas ref={canvasRef} className="w-full h-full block cursor-crosshair"></canvas>

            {/* Radar Beam Marker */}
            <div className="absolute left-[33%] top-0 bottom-0 border-l-2 border-dashed border-amber-500/70 pointer-events-none flex items-center">
              <span className="text-[10px] font-mono bg-amber-950/90 text-amber-300 px-1.5 py-0.5 rounded rotate-90 -ml-5 shadow">
                1. 레이더 속도검출
              </span>
            </div>

            {/* Camera Trap Marker */}
            <div className="absolute left-[66%] top-0 bottom-0 border-l-2 border-solid border-red-500/80 pointer-events-none flex items-center">
              <span className="text-[10px] font-mono bg-red-950/90 text-red-300 px-1.5 py-0.5 rounded rotate-90 -ml-5 shadow">
                2. 카메라 Trap & 셔터
              </span>
            </div>
          </div>

          {/* Simulation Action Buttons */}
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              id="spawn-normal-btn"
              type="button"
              onClick={() => spawnVehicle('normal')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs py-2.5 px-3 rounded-lg flex items-center justify-center space-x-1.5 shadow transition cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>정상 차량 통과</span>
            </button>

            <button
              id="spawn-overspeed-btn"
              type="button"
              onClick={() => spawnVehicle('overspeed')}
              className="bg-red-600 hover:bg-red-500 text-white font-medium text-xs py-2.5 px-3 rounded-lg flex items-center justify-center space-x-1.5 shadow transition cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>과속 차량 발생</span>
            </button>

            <button
              id="auto-loop-btn"
              type="button"
              onClick={toggleAutoLoop}
              className={`text-white font-medium text-xs py-2.5 px-3 rounded-lg flex items-center justify-center space-x-1.5 shadow transition cursor-pointer ${
                isAutoLoop
                  ? 'bg-amber-600 hover:bg-amber-500 animate-pulse'
                  : 'bg-blue-600 hover:bg-blue-500'
              }`}
            >
              {isAutoLoop ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isAutoLoop ? '자동 트래픽 중지' : '자동 트래픽 시작'}</span>
            </button>

            <button
              id="manual-shutter-btn"
              type="button"
              onClick={handleManualShutter}
              className="bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs py-2.5 px-3 rounded-lg flex items-center justify-center space-x-1.5 shadow transition cursor-pointer"
            >
              <Aperture className="w-4 h-4" />
              <span>강제 셔터링</span>
            </button>
          </div>

          {/* Settings Bar */}
          <div className="mt-3 pt-2.5 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs gap-2">
            <div className="flex items-center space-x-2">
              <span className="text-slate-400 font-medium">제한속도 설정:</span>
              {[20, 30, 50, 80].map((limit) => (
                <button
                  key={limit}
                  id={`limit-btn-${limit}`}
                  type="button"
                  onClick={() => onSetRoadLimit(limit)}
                  className={`px-2.5 py-1 rounded font-bold transition cursor-pointer ${
                    roadLimit === limit
                      ? 'bg-amber-500 text-slate-950 border border-amber-400 shadow-sm'
                      : 'bg-slate-800 text-slate-300 font-medium border border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {limit} km/h
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-slate-400 font-medium">연동 카메라:</span>
              <select
                id="camera-select"
                value={selectedCamera}
                onChange={(e) => onSelectCamera(e.target.value)}
                className="bg-slate-950 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="TNO-7180RLP">한화비전 TNO-7180RLP (Global Shutter)</option>
                <option value="XNB-6002">한화비전 XNB-6002 (Rolling / Head-Separated)</option>
                <option value="MV-CS020-10GM">Hikrobot MV-CS020-10GM (Machine Vision 1ms)</option>
                <option value="AR0234">AR0234 USB 3.0 (Embedded Module)</option>
                <option value="ITC237-PW6M">Dahua DHI-ITC237-PW6M (ITS ANPR)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Snapshots Bar */}
      <div id="recent-snapshots-bar" className="bg-slate-900 rounded-xl border border-slate-800 p-3.5 space-y-2 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-200 flex items-center space-x-1.5">
            <ImageIcon className="w-4 h-4 text-amber-400" />
            <span>최근 단속 캡처 스냅샷 (실시간 OCR & 메타데이터 오버레이)</span>
          </span>
          <span className="text-xs text-slate-400">클릭 시 정밀 모달 조회</span>
        </div>

        <div className="flex space-x-3 overflow-x-auto pb-1 min-h-[105px] items-center text-xs text-slate-500">
          {recentSnapshots.length === 0 ? (
            <p className="w-full text-center py-4">
              아직 촬영된 단속 데이터가 없습니다. 상단의 '과속 차량 발생' 버튼을 눌러보세요.
            </p>
          ) : (
            recentSnapshots.map((item) => (
              <div
                key={item.id}
                onClick={() => onOpenModal(item)}
                className="flex-shrink-0 w-36 bg-slate-950 border border-slate-800 rounded-lg overflow-hidden cursor-pointer hover:border-amber-500 transition group shadow-sm"
              >
                <div className="relative h-20 bg-slate-900 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.plate}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                  />
                  <span className="absolute top-1 right-1 bg-red-600 text-white font-mono text-[9px] px-1 py-0.5 rounded font-bold">
                    {item.speed} km/h
                  </span>
                </div>
                <div className="p-1.5 font-mono text-[10px] space-y-0.5">
                  <p className="text-slate-200 font-bold truncate">{item.plate}</p>
                  <p className="text-slate-400 text-[9px]">{item.timestamp}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
