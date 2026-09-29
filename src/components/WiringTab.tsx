import React, { useState } from 'react';
import { Cpu, Code, Copy, Check, ShieldCheck, Zap } from 'lucide-react';

export const WiringTab: React.FC = () => {
  const [copied, setCopied] = useState<boolean>(false);

  const espCode = `// ESP32 Camera Shutter Trigger Pin Config & ISR Logic
#define SPEED_RADAR_RX_PIN 16   // UART2 RX from Radar Sensor
#define SHUTTER_TRIGGER_PIN 23  // Relay / Optocoupler Gate Trigger

void setup() {
  Serial.begin(115200);
  Serial2.begin(9600, SERIAL_8N1, SPEED_RADAR_RX_PIN, -1);
  pinMode(SHUTTER_TRIGGER_PIN, OUTPUT);
  digitalWrite(SHUTTER_TRIGGER_PIN, LOW);
}

void triggerCameraShutter(int measuredSpeed, int limitSpeed) {
  if (measuredSpeed > limitSpeed) {
    // 1. High-speed pulse generation (50ms Active HIGH for Relay/Alarm IN)
    digitalWrite(SHUTTER_TRIGGER_PIN, HIGH);
    delay(50); // Contact hold duration for CCTV Alarm IN detection
    digitalWrite(SHUTTER_TRIGGER_PIN, LOW);
    
    // 2. Transmit speed data via RS485/UART to DFS LED Signboard
    updateDFSDisplay(measuredSpeed, true);
  }
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(espCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Intro Header */}
      <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 shadow-sm">
        <h2 className="text-sm font-bold text-amber-400 flex items-center space-x-2 mb-1">
          <Cpu className="w-4.5 h-4.5" />
          <span>속도 제어 보드 & 카메라 알람 포트(Alarm IN) 하드웨어 결선</span>
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          ESP32 및 속도 센서(레이더) 메인 컨트롤러와 CCTV/머신비전 카메라 후면 포트 간 유선 셔터링 연동을 위한 신호
          인터페이스 방식 및 안전 결선 가이드입니다.
        </p>
      </div>

      {/* Wiring Schematics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Dry Contact Card */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-xs text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              1. Dry Contact (무전압 스위치 접점 방식)
            </span>
            <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800/80 font-medium">
              가장 권장됨
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            속도 측정 보드의 릴레이(Relay) 접점이 단락(Short)될 때 카메라의 Alarm IN 포트와 GND가 내부 통전되어 셔터
            스냅샷을 유발하는 표준 방식입니다.
          </p>

          {/* High Contrast Circuit Block */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs space-y-3 shadow-inner">
            <div className="flex items-center justify-between gap-2">
              {/* Board Box */}
              <div className="bg-slate-800 p-2.5 rounded-lg border border-slate-700 text-center w-2/5 shadow-sm">
                <span className="text-amber-400 font-bold block text-[11px]">속도 제어 보드</span>
                <span className="text-[10px] text-slate-400">(ESP32 / Relay)</span>
                <div className="mt-2 space-y-1 text-[10px]">
                  <div className="bg-slate-900 py-0.5 rounded text-emerald-400 font-semibold">NO (Relay Out)</div>
                  <div className="bg-slate-900 py-0.5 rounded text-emerald-400 font-semibold">COM (Common)</div>
                </div>
              </div>

              {/* Wire lines */}
              <div className="flex flex-col items-center justify-center flex-1 space-y-2">
                <div className="w-full flex items-center">
                  <div className="h-0.5 bg-amber-500 flex-1"></div>
                  <span className="text-[9px] text-amber-400 bg-amber-950 px-1 rounded mx-0.5">신호선</span>
                  <div className="h-0.5 bg-amber-500 flex-1"></div>
                </div>
                <div className="w-full flex items-center">
                  <div className="h-0.5 bg-slate-500 flex-1"></div>
                  <span className="text-[9px] text-slate-400 bg-slate-900 px-1 rounded mx-0.5">GND</span>
                  <div className="h-0.5 bg-slate-500 flex-1"></div>
                </div>
              </div>

              {/* Camera Box */}
              <div className="bg-slate-800 p-2.5 rounded-lg border border-amber-500/50 text-center w-2/5 shadow-sm">
                <span className="text-emerald-400 font-bold block text-[11px]">한화/CCTV 카메라</span>
                <span className="text-[10px] text-slate-400">(후면 포트)</span>
                <div className="mt-2 space-y-1 text-[10px]">
                  <div className="bg-slate-900 py-0.5 rounded text-amber-300 font-semibold">ALARM IN 1</div>
                  <div className="bg-slate-900 py-0.5 rounded text-slate-300 font-semibold">GND</div>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 leading-normal border-t border-slate-800 pt-2 font-sans">
              * <strong>핵심 장점</strong>: 외부 극성 전압이 인가되지 않으므로 카메라 내부 메인보드 손상 위험이 없으며 안전성이
              가장 우수합니다.
            </p>
          </div>
        </div>

        {/* Wet Contact Card */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-xs text-amber-400 flex items-center gap-1.5">
              <Zap className="w-4 h-4" />
              2. Wet Contact (유전압 펄스 / Optocoupler)
            </span>
            <span className="text-[10px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-800/80 font-medium">
              고속 머신비전용
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            속도 제어기에서 +5V ~ +12V DC 전압 펄스를 순간 출력하여 카메라의 포토커플러(Optocoupler) 절연 입력을 직접
            구동시키는 방식입니다.
          </p>

          {/* High Contrast Circuit Block */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs space-y-3 shadow-inner">
            <div className="flex items-center justify-between gap-2">
              {/* Board Box */}
              <div className="bg-slate-800 p-2.5 rounded-lg border border-slate-700 text-center w-2/5 shadow-sm">
                <span className="text-amber-400 font-bold block text-[11px]">속도 제어 보드</span>
                <span className="text-[10px] text-slate-400">(GPIO Digital Out)</span>
                <div className="mt-2 space-y-1 text-[10px]">
                  <div className="bg-slate-900 py-0.5 rounded text-red-400 font-semibold">+5V/12V Pulse</div>
                  <div className="bg-slate-900 py-0.5 rounded text-slate-400 font-semibold">GND Return</div>
                </div>
              </div>

              {/* Wire lines */}
              <div className="flex flex-col items-center justify-center flex-1 space-y-2">
                <div className="w-full flex items-center">
                  <div className="h-0.5 bg-red-500 flex-1"></div>
                  <span className="text-[9px] text-red-400 bg-red-950 px-1 rounded mx-0.5">+Pulse</span>
                  <div className="h-0.5 bg-red-500 flex-1"></div>
                </div>
                <div className="w-full flex items-center">
                  <div className="h-0.5 bg-slate-500 flex-1"></div>
                  <span className="text-[9px] text-slate-400 bg-slate-900 px-1 rounded mx-0.5">-Pulse</span>
                  <div className="h-0.5 bg-slate-500 flex-1"></div>
                </div>
              </div>

              {/* Machine Vision Box */}
              <div className="bg-slate-800 p-2.5 rounded-lg border border-red-500/50 text-center w-2/5 shadow-sm">
                <span className="text-red-400 font-bold block text-[11px]">머신비전 GPIO</span>
                <span className="text-[10px] text-slate-400">(Hirose 6Pin)</span>
                <div className="mt-2 space-y-1 text-[10px]">
                  <div className="bg-slate-900 py-0.5 rounded text-red-300 font-semibold">Line0 (+)</div>
                  <div className="bg-slate-900 py-0.5 rounded text-slate-300 font-semibold">Line0 (-)</div>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 leading-normal border-t border-slate-800 pt-2 font-sans">
              * <strong>핵심 장점</strong>: 1ms 미만의 즉각적인 하드웨어 물리 반응 속도를 제공하며 고속도로 차로 단속 시
              오차가 거의 없습니다.
            </p>
          </div>
        </div>
      </div>

      {/* Pinout Specifications Table */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-200">주요 핀맵 및 인터페이스 전기 규격</span>
          <span className="text-[10px] text-slate-500 font-mono">신호 전송 기준</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="bg-slate-950/70 text-slate-400 border-b border-slate-800">
                <th className="p-2.5 font-sans">신호 명칭</th>
                <th className="p-2.5 font-sans">ESP32 핀</th>
                <th className="p-2.5 font-sans">카메라 연결 핀</th>
                <th className="p-2.5 font-sans">전기적 스펙</th>
                <th className="p-2.5 font-sans">보호 권장 사항</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300 text-[11px]">
              <tr className="hover:bg-slate-800/30">
                <td className="p-2.5 text-amber-400 font-bold">Alarm IN 1</td>
                <td className="p-2.5">GPIO 23 (Relay Out)</td>
                <td className="p-2.5">Camera Pin 1 (IN)</td>
                <td className="p-2.5">무전압 접점 (Pull-up 3.3V)</td>
                <td className="p-2.5 text-slate-400 font-sans">TVSS 서지 억제 다이오드 부착 권장</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="p-2.5 text-slate-400 font-bold">Common GND</td>
                <td className="p-2.5">GND</td>
                <td className="p-2.5">Camera GND</td>
                <td className="p-2.5">0V 공통 접지</td>
                <td className="p-2.5 text-slate-400 font-sans">접지 루프 방지용 단일 지점 접지</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="p-2.5 text-emerald-400 font-bold">RS485 TX/RX</td>
                <td className="p-2.5">GPIO 17 / GPIO 16</td>
                <td className="p-2.5">DFS 전광판 A/B</td>
                <td className="p-2.5">차동 5V (Half-Duplex)</td>
                <td className="p-2.5 text-slate-400 font-sans">120Ω 종단 저항 (Termination)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ESP32 Implementation Reference Code */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-amber-400 flex items-center space-x-1.5">
            <Code className="w-4 h-4" />
            <span>ESP32 MCU 셔터 트리거 펄스 생성 로직 예제</span>
          </h3>
          <button
            type="button"
            onClick={handleCopy}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg flex items-center space-x-1.5 border border-slate-700 transition cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">복사 완료!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>코드 복사</span>
              </>
            )}
          </button>
        </div>

        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 leading-relaxed overflow-x-auto shadow-inner">
          <pre className="text-emerald-400">{espCode}</pre>
        </div>
      </div>
    </div>
  );
};
