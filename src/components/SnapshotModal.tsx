import React from 'react';
import { ShieldAlert, X, Download } from 'lucide-react';
import { LogEntry } from '../types';

interface SnapshotModalProps {
  item: LogEntry | null;
  onClose: () => void;
}

export const SnapshotModal: React.FC<SnapshotModalProps> = ({ item, onClose }) => {
  if (!item) return null;

  const handleDownload = () => {
    if (!item.imageUrl) return;
    const a = document.createElement('a');
    a.href = item.imageUrl;
    a.download = `Traffic_Enforcement_${item.plate.replace(/\s+/g, '_')}_${item.speed}kmh.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div
      id="snapshot-modal-backdrop"
      className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-200"
      onClick={onClose}
    >
      <div
        id="snapshot-modal-card"
        className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm text-white">단속 스냅샷 정밀 분석 (OCR & OSD 오버레이)</h3>
          </div>
          <button
            id="modal-close-btn"
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-3">
          <div className="rounded-xl overflow-hidden border border-slate-800 bg-black shadow-inner">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt="Traffic CCTV Capture"
                className="w-full h-auto block object-contain"
              />
            ) : (
              <div className="p-12 text-center text-slate-500 text-xs">이미지가 없습니다.</div>
            )}
          </div>

          <div id="modal-info-panel" className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs space-y-2 font-mono text-slate-300">
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-500">촬영 시각:</span>{' '}
                <span className="text-slate-200 font-semibold">{item.timestamp}</span>
              </div>
              <div>
                <span className="text-slate-500">차량 번호:</span>{' '}
                <strong className="text-amber-400 font-bold">{item.plate}</strong>
              </div>
              <div>
                <span className="text-slate-500">측정 속도:</span>{' '}
                <strong className={item.isOverspeed ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                  {item.speed} km/h
                </strong>
              </div>
              <div>
                <span className="text-slate-500">제한 속도:</span>{' '}
                <span className="text-slate-300">{item.limit} km/h</span>
              </div>
              <div className="col-span-2 pt-1 border-t border-slate-800/80">
                <span className="text-slate-500">연동 카메라:</span>{' '}
                <span className="text-emerald-400 font-semibold">{item.camera}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-500">위반 여부:</span>{' '}
                {item.isOverspeed ? (
                  <span className="text-red-400 font-bold bg-red-950/80 px-2 py-0.5 rounded border border-red-800/80 text-[10px]">
                    초과 위반 (+{item.speed - item.limit} km/h)
                  </span>
                ) : (
                  <span className="text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/80 text-[10px]">
                    정상 규정속도 준수
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-3 bg-slate-950 border-t border-slate-800 flex justify-end space-x-2">
          {item.imageUrl && (
            <button
              id="modal-download-btn"
              type="button"
              onClick={handleDownload}
              className="bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs py-2 px-4 rounded-lg flex items-center space-x-1.5 transition cursor-pointer shadow"
            >
              <Download className="w-4 h-4" />
              <span>이미지 다운로드</span>
            </button>
          )}
          <button
            id="modal-dismiss-btn"
            type="button"
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs py-2 px-4 rounded-lg transition cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
