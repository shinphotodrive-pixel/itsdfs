import React, { useState, useMemo } from 'react';
import { Search, Trash2, ShieldAlert, Download } from 'lucide-react';
import { LogEntry } from '../types';

interface LogsTabProps {
  logs: LogEntry[];
  onClearLogs: () => void;
  onOpenModal: (item: LogEntry) => void;
}

export const LogsTab: React.FC<LogsTabProps> = ({ logs, onClearLogs, onOpenModal }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'OVER' | 'SAFE'>('ALL');

  const filteredLogs = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return logs.filter((log) => {
      const matchesSearch =
        !q ||
        log.plate.toLowerCase().includes(q) ||
        String(log.speed).includes(q) ||
        log.camera.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      if (filterStatus === 'OVER') return log.isOverspeed;
      if (filterStatus === 'SAFE') return !log.isOverspeed;
      return true;
    });
  }, [logs, searchTerm, filterStatus]);

  const handleClear = () => {
    if (logs.length === 0) return;
    if (window.confirm('모든 통과 및 과속 단속 기록을 삭제하시겠습니까?')) {
      onClearLogs();
    }
  };

  const exportToCSV = () => {
    if (filteredLogs.length === 0) return;

    const headers = [
      '기록 ID',
      '감지/단속 시각',
      '차량 번호',
      '측정 속도 (km/h)',
      '도로 제한속도 (km/h)',
      '초과 속도 (km/h)',
      '단속 상태',
      '적용 단속 카메라',
      '스냅샷 캡처 여부'
    ];

    const rows = filteredLogs.map((log) => [
      log.id,
      `"${log.timestamp}"`,
      `"${log.plate}"`,
      log.speed,
      log.limit,
      log.isOverspeed ? log.speed - log.limit : 0,
      `"${log.isOverspeed ? '속도위반' : '정상통과'}"`,
      `"${log.camera.replace(/"/g, '""')}"`,
      `"${log.imageUrl ? '캡처 완료' : '미캡처'}"`
    ]);

    const csvContent =
      '\uFEFF' +
      [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const now = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.setAttribute('download', `speed_enforcement_logs_${now}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-3">
      {/* Intro Header */}
      <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 text-xs leading-relaxed text-slate-300 shadow-sm">
        <strong className="text-amber-400 font-bold block mb-0.5">통과 차량 및 속도위반 단속 이력 데이터베이스</strong>
        레이더 센서로 측정된 통과 차량 전체의 실시간 속도 기록 및 카메라 셔터링 동작 여부를 검색하고 관리할 수 있습니다.
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              id="log-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="차량번호 / 속도 / 카메라 검색..."
              className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-amber-500"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-2.5 top-2 pointer-events-none" />
          </div>

          <select
            id="log-filter-status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'ALL' | 'OVER' | 'SAFE')}
            className="bg-slate-950 text-slate-200 border border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="ALL">전체 보기</option>
            <option value="OVER">과속 위반만</option>
            <option value="SAFE">안전 운행만</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <button
            id="export-csv-btn"
            type="button"
            onClick={exportToCSV}
            disabled={filteredLogs.length === 0}
            className={`text-xs border px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition ${
              filteredLogs.length === 0
                ? 'text-slate-600 border-slate-800 bg-slate-950/20 cursor-not-allowed'
                : 'text-emerald-400 hover:text-emerald-300 border-emerald-900/60 bg-emerald-950/40 hover:bg-emerald-900/30 cursor-pointer shadow-sm'
            }`}
            title="현재 표시된 로그 데이터를 CSV 파일로 다운로드합니다"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV 내보내기 ({filteredLogs.length})</span>
          </button>

          <button
            id="clear-logs-btn"
            type="button"
            onClick={handleClear}
            disabled={logs.length === 0}
            className={`text-xs border px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition ${
              logs.length === 0
                ? 'text-slate-600 border-slate-800 bg-slate-950/20 cursor-not-allowed'
                : 'text-red-400 hover:text-red-300 border-red-900/60 bg-red-950/40 hover:bg-red-900/30 cursor-pointer'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>로그 전체 삭제 ({logs.length})</span>
          </button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table id="logs-table" className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 font-semibold">
                <th className="p-3">촬영/감지 시각</th>
                <th className="p-3">차량 번호</th>
                <th className="p-3">측정 속도</th>
                <th className="p-3">상태</th>
                <th className="p-3">적용 카메라</th>
                <th className="p-3 text-center">스냅샷</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 font-sans">
                    {logs.length === 0
                      ? '감지된 차량 기록이 없습니다. 시뮬레이터에서 차량을 발생시켜 보세요.'
                      : '검색 조건에 일치하는 기록이 없습니다.'}
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition border-b border-slate-800/50">
                    <td className="p-3 text-slate-400">{log.timestamp}</td>
                    <td className="p-3 font-bold text-white flex items-center space-x-1.5">
                      {log.isOverspeed && <ShieldAlert className="w-3.5 h-3.5 text-red-400 inline shrink-0" />}
                      <span>{log.plate}</span>
                    </td>
                    <td className={`p-3 font-bold ${log.isOverspeed ? 'text-red-400' : 'text-emerald-400'}`}>
                      {log.speed} km/h
                      <span className="text-[10px] text-slate-500 ml-1 font-normal">(제한 {log.limit})</span>
                    </td>
                    <td className="p-3">
                      {log.isOverspeed ? (
                        <span className="bg-red-950/80 text-red-400 border border-red-800/80 px-2 py-0.5 rounded text-[10px] font-sans font-bold">
                          속도위반 (+{log.speed - log.limit})
                        </span>
                      ) : (
                        <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 px-2 py-0.5 rounded text-[10px] font-sans">
                          정상통과
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-slate-400 text-[11px] truncate max-w-[150px]">{log.camera}</td>
                    <td className="p-3 text-center">
                      {log.imageUrl ? (
                        <button
                          type="button"
                          onClick={() => onOpenModal(log)}
                          className="bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 px-2.5 py-1 rounded border border-amber-500/30 text-[11px] font-sans transition cursor-pointer"
                        >
                          스냅샷
                        </button>
                      ) : (
                        <span className="text-slate-600 font-sans">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
